<?php
// Take a POST from the anecdote form
// Verify a signed timestamp (proves the form was loaded from our server, and when)
// Run anti-spam and input validation checks, rate-limit per IP
// And then send the anecdote to myself
error_reporting(E_ALL);
ini_set('display_errors', '0');
date_default_timezone_set('America/New_York');

// Settings
$to            = 'info@artinruins.com';
$minSeconds    = 10;     // Faster than this = bot
$maxSeconds    = 86400;  // Form tokens expire after 24 hours
$rateLimit     = 3;      // Max sends per IP...
$rateWindow    = 3600;   // ...per this many seconds
$privateDir    = dirname($_SERVER['DOCUMENT_ROOT']);          // Outside the web root
$secretFile    = $privateDir . '/.artinruins-form-secret';
$rateDir       = $privateDir . '/.artinruins-ratelimit';

// Helpers
function field($key, $max) {
  // Only accept plain strings (arrays like email[]= are rejected), trimmed and length-capped
  if ( ! isset($_POST[$key]) || ! is_string($_POST[$key]) ) return '';
  return mb_substr(trim($_POST[$key]), 0, $max, 'UTF-8');
}
function h($s) {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
function page($title, $body, $extraHead = '') {
  echo '<!doctype HTML><html lang="en"><head><title>' . $title . ' | ArtInRuins</title><meta charset="utf-8">' . $extraHead . '<link rel="stylesheet" type="text/css" href="/assets/css/main.css"><link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png"></head><body class="content rhythm u__vertical__p u__gutter__p">' . $body . '</body></html>';
}
function rate_limited($dir, $ip, $secret, $limit, $window) {
  // File-based counter per hashed IP. Returns true if this IP is over the limit.
  if ( ! is_dir($dir) && ! @mkdir($dir, 0700, true) ) {
    error_log('Mailer.php — Could not create rate-limit dir: ' . $dir);
    return false; // Fail open on storage problems so real people can still send
  }
  $file = $dir . '/' . hash_hmac('sha256', $ip, $secret) . '.json';
  $fp = @fopen($file, 'c+');
  if ( ! $fp ) return false;
  flock($fp, LOCK_EX);
  $times = json_decode(stream_get_contents($fp), true);
  $times = is_array($times) ? $times : array();
  $now = time();
  $times = array_values(array_filter($times, function ($t) use ($now, $window) { return is_int($t) && ($now - $t) < $window; }));
  $over = count($times) >= $limit;
  if ( ! $over ) $times[] = $now;
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, json_encode($times));
  flock($fp, LOCK_UN);
  fclose($fp);
  return $over;
}

// Only accept POST
if ( ($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || ! count($_POST) ) {
  error_log('Mailer.php — No post was found at all');
  http_response_code(405);
  header('Allow: POST');
  page('No post', '<h1>No post found</h1><p>Incomplete form submission (required fields not supplied).</p>');
  exit;
}

$postaction  = field('submit', 50);
$theiremail  = field('email', 254);
$theirname   = field('name', 100);
$theirweb    = field('website', 500); // honeypot
$anecdote    = field('message', 5000);
$timeofinput = field('timestamp', 20);
$token       = field('token', 64);
$isEssay     = ( field('essay', 200) !== '' );
$prop_or_essay = $isEssay ? 'essay' : 'property';
$property    = $isEssay ? field('essay', 200) : field('property', 200);
$now         = time();

$secret = is_readable($secretFile) ? trim(file_get_contents($secretFile)) : '';
if ( strlen($secret) < 32 ) {
  // Misconfiguration, not spam: tell the person so their message is not silently lost
  error_log('Mailer.php — Secret file missing or too short: ' . $secretFile);
  http_response_code(500);
  page('Form unavailable', '<h1>Sorry, the form is temporarily unavailable</h1><p>Please send your anecdote via email to <a href="mailto:info@artinruins.com">info@artinruins.com</a>.</p>');
  exit;
}

// Anti-spam techniques from https://webaim.org/blog/spam_free_accessible_forms/
$spam = false;
// Make sure all required fields have content
if ( $theiremail === '' || $theirname === '' || $anecdote === '' || $timeofinput === '' || $property === '' ) {
  error_log('Mailer.php — One of the required fields was posted empty');
  $spam = true;
}
// If the website field has content, this is spam — Honeypot
if ( $theirweb !== '' ) {
  error_log('Mailer.php — The honeypot field was submitted with content');
  $spam = true;
}
// Header injection: no line breaks allowed in any single-line field
if ( preg_match("/[\r\n]/", $theiremail . $theirname . $property . $timeofinput . $token . $postaction) ) {
  error_log('Mailer.php — Line breaks found in a single-line field (header injection attempt)');
  $spam = true;
}
// Email must be a valid address
if ( ! filter_var($theiremail, FILTER_VALIDATE_EMAIL) ) {
  error_log('Mailer.php — Invalid email address');
  $spam = true;
}
// Property/essay must be a valid slug (lowercase letters, numbers, hyphens)
if ( ! preg_match('/^[a-z0-9-]{1,200}$/', $property) ) {
  error_log('Mailer.php — Invalid property/essay slug');
  $spam = true;
  $property = ''; // Never reflect an invalid slug into a URL
}
// Check to see if BCC, CC, or forum [url] strings are included
if ( preg_match("/bcc:|cc:|multipart|\[url|Content-Type:/i", $theiremail . $theirname . $anecdote . $property) ) {
  error_log('Mailer.php — BCC, CC, or forum strings were included, which are not allowed');
  $spam = true;
}
// Check to see if there are more than 3 URLs in the message
if ( preg_match_all("/(<a|http:|https:)/i", $anecdote) > 3 ) {
  error_log('Mailer.php — More than 3 urls were included in the posted message');
  $spam = true;
}
// Grep for spam keywords
$spamwords = "/(viagra|cialis|DHL)/i";
if ( preg_match($spamwords, $anecdote) ) {
  error_log('Mailer.php — One of the supplied spam words was included in the message');
  $spam = true;
}
// Verify the signed timestamp: it must come from anecdote-form.php and not be altered
$elapsed = 0;
if ( ! ctype_digit($timeofinput) || ! hash_equals(hash_hmac('sha256', $timeofinput, $secret), $token) ) {
  error_log('Mailer.php — Missing or invalid form token');
  $spam = true;
} else {
  // If a certain amount of time has NOT elapsed, this is a robot
  // The form loads after 10 seconds (or on click), so a human needs longer than that to type
  $elapsed = $now - (int) $timeofinput;
  if ( $elapsed < $minSeconds ) {
    error_log('Mailer.php — Submitted ' . $elapsed . ' seconds after the form loaded (minimum ' . $minSeconds . ')');
    $spam = true;
  } elseif ( $elapsed > $maxSeconds ) {
    error_log('Mailer.php — Form token expired (' . $elapsed . ' seconds old)');
    $spam = true;
  }
}
if ( $postaction !== 'Submit Anecdote' ) {
  error_log('Mailer.php — Unexpected submit value');
  $spam = true;
}
// Rate limit per IP (only counted for submissions that would otherwise be sent)
if ( ! $spam && rate_limited($rateDir, $_SERVER['REMOTE_ADDR'] ?? '', $secret, $rateLimit, $rateWindow) ) {
  error_log('Mailer.php — Rate limit reached for this IP');
  $spam = true;
}

// Safe return path: only ever a path on this site
$returnPath = ( $property !== '' ) ? '/' . $prop_or_essay . '/' . $property . '/' : '/';

if ( $spam ) {
  // This message is likely spam — Treat it with a generic success message
  error_log('Mailer.php — This message was likely spam so a fake Thank You message was provided');
  page('Thanks', '<h1>Thank you</h1><p>Your message has been sent.</p>', '<meta http-equiv="refresh" content="15;url=' . h($returnPath) . '">');
  exit;
}

// Escaped values for the email body (same format as before) and for HTML output
$property_h  = h($property);
$theirname_h = h($theirname);
$theiremail_h = h($theiremail);
$anecdote_h  = h($anecdote);

// Now that all checks have passed, send the message
$subject = "Anecdote about " . $property;

$bodyofmessage = "From: " . $theiremail . "\n\n";
$bodyofmessage .= "- " . $prop_or_essay . ": " . $property . "\n";
$bodyofmessage .= "  person: '" . $theirname_h . "'\n";
$bodyofmessage .= "  date: '" . date('Y-m-d') . "'\n";
$bodyofmessage .= "  content: '" . $anecdote_h . "'\n";
$bodyofmessage .= "\n" . "Antispam checks: \n";
$bodyofmessage .= "Time of post process = " . date('YmdHis', $now) . "\n";
$bodyofmessage .= "Time of input = " . date('YmdHis', (int) $timeofinput) . "\n";
$bodyofmessage .= "Seconds elapsed = " . $elapsed;

// $theiremail has passed FILTER_VALIDATE_EMAIL and the no-line-break check, so it is safe in a header
$headers = "From: " . $to . "\r\n" . "Reply-To: " . $theiremail . "\r\n" . "X-Mailer: PHP";

if ( mail($to, $subject, $bodyofmessage, $headers) ) {
  page('Thanks for your Anecdote', '<h1>Success; your anecdote was sent</h1><p>New anecdotes will not appear on the site immediately. <a href="' . h($returnPath) . '#anecdotes">Return to your previous destination.</a></p><hr><h2>Message synopsis</h2><p><b>Subject:</b> ' . h($subject) . '<br><b>Sent to:</b> ' . $to . '<br><b>Name:</b> ' . $theirname_h . '<br><b>Email:</b> ' . $theiremail_h . '</p><p><b>Message:</b><br>' . nl2br($anecdote_h) . '</p>');
} else {
  $err = error_get_last();
  error_log('Mailer.php — Sending mail failed: ' . ( $err['message'] ?? 'unknown error' ));
  page('Not sent', '<h1>Sorry, the mail function failed</h1><p>We are sorry for the inconvenience. You can always send a message via good’ole email at <a href="mailto:info@artinruins.com">info@artinruins.com</a>. Your message as it was captured is below.</p><hr><h2>Message synopsis</h2><p><b>Your Name:</b> ' . $theirname_h . '<br><b>Your Email:</b> ' . $theiremail_h . '<br><b>The ' . $prop_or_essay . ':</b> ' . $property_h . '</p><p><b>Your Message:</b><br>' . nl2br($anecdote_h) . '</p>');
}

<?php
// Take a POST from another file
// Check the timestamp and make sure a defined amount of time has past
// (this is an effort to make sure it was a human)
// And then send the anecdote to myself
error_reporting(E_ALL);
date_default_timezone_set('America/New_York');

if ( count($_POST) ) {
  $postaction = $_POST['submit'];
  $theiremail = $_POST['email'];
  $theirname = $_POST['name'];
  $theirweb = htmlspecialchars($_POST['website']); // honeypot
  $anecdote = $_POST['message'];
  $property = $_POST['property'];
  $timeofinput = $_POST['timestamp'];
  $now = date( 'YmdHis' );
  
  // Anti-spam techniques from https://webaim.org/blog/spam_free_accessible_forms/
  $spam = false;
  // Make sure all required fields have content
  if ( empty($theiremail) || empty($theirname) || empty($anecdote) || empty($timeofinput) ) {
    error_log('Mailer.php — One of the required fields was posted empty');
    $spam = true;
  }
  // If the website field has content, this is spam — Honeypot
  if ( ! empty($theirweb) ) {
    error_log('Mailer.php — The honeypot field was submitted with content: ' . $theirweb);
    $spam = true;
  }
  // Check to see if BCC, CC, or forum [url] strings are included
  if ( preg_match( "/bcc:|cc:|multipart|\[url|Content-Type:/i", implode($_POST)) ) {
    error_log('Mailer.php — BCC or CC strings were included, which are not allowed');
    $spam = true;
  }
  // Check to see if there are more than 3 URLs in any field
  if ( preg_match("/(<a|http:|https:)/i", $anecdote, $output) > 3 ) {
    error_log('Mailer.php — More than 3 urls were included in the posted message');
    $spam = true;
  }
  // Grep for spam keywords
  $spamwords = "/(viagra|cialis|DHL)/i";
  if ( preg_match($spamwords, $anecdote) ) {
    error_log('Mailer.php — One of the supplied spam words was included in the message');
    $spam = true;
  }
  // If a certain amount of time has NOT elapsed, this is a robot
  // The form itself loads only after 10 seconds
  // If a submission comes in under 10 seconds, this is a bot trying to hit the mailer.php script externally
  if ( ($now - $timeofinput) < 10 ) {
    error_log('Mailer.php — The time between then and now was less than 10 seconds: Now=' . $now . ' and Then=' . $timeofinput . ' and ($now - $timeofinput) = ' . ($now - $timeofinput) );
    $spam = true;
  }
//now  2022 02 26 121447
//then 2022 02 26 171002

  $property = htmlspecialchars($property);
  $theirname = htmlspecialchars($theirname);
  $theiremail = htmlspecialchars($theiremail);
  $anecdote = htmlspecialchars($anecdote, ENT_QUOTES, 'UTF-8');

  if ( $spam === false && $postaction == 'Submit Anecdote' ) {
    // Now that all checks have passed, send the message
    $to = 'info@artinruins.com';
    $subject = "Anecdote about ". $property;
    
    $bodyofmessage = "From: ".$theiremail."\n\n";
    $bodyofmessage .= "- property: ".$property."\n";
    $bodyofmessage .= "  person: '".$theirname."'\n";
    $bodyofmessage .= "  date: '".date('Y-m-d')."'\n";
    $bodyofmessage .= "  content: '".$anecdote."'\n";
    $bodyofmessage .= "\n" . "Antispam checks: \n";
    $bodyofmessage .= "Time of post process = ".$now."\n";
    $bodyofmessage .= "Time of input = ".$timeofinput."\n";
    $bodyofmessage .= "Now minus then = ".($now - $timeofinput);
    
    $headers = "From: ". $theiremail . "\r\n" . "Reply-To: " . $theiremail . "\r\n" . "X-Mailer: PHP/" . phpversion();
    
    if ( mail($to, $subject, $bodyofmessage, $headers) ) {
      // echo '<pre>';
      // print_r($_POST);
      // echo '</pre>';
      echo '<!doctype HTML><html lang="en"><head><title>Thanks for your Anecdote | ArtInRuins</title><meta charset="utf-8"><link rel="stylesheet" type="text/css" href="/assets/css/main.css"><link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png"></head><body class="content rhythm u__vertical__p u__gutter__p"><h1>Success; your anecdote was sent</h1><p>New anecdotes will not appear on the site immediately. <a href="//artinruins.com/property/'.$property.'#anecdotes">Return to your previous destination.</a></p><hr><h2>Message synopsis</h2><p><b>Subject:</b> '.$subject.'<br><b>Sent to:</b> '.$to.'<br><b>Name:</b> '.$theirname.'<br><b>Email:</b> '.$theiremail.'</p><p><b>Message:</b><br>'.$anecdote.'</p></body></html>';
    } else {
      error_log('Mailer.php — Sending mail failed: ' . error_get_last());
      echo '<!doctype HTML><html lang="en"><head><title>No post | ArtInRuins</title><meta charset="utf-8"><link rel="stylesheet" type="text/css" href="/assets/css/main.css"><link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png"></head><body class="content rhythm u__vertical__p u__gutter__p"><h1>Sorry, the mail function failed</h1><p>We are sorry for the inconvenience. You can always send a message via good’ole email at <a href="mailto:info@artinruins.com">info@artinruins.com</a>. Your message as it was captured is below.</p><hr><h2>Message synopsis</h2><p><b>Your Name:</b> '.$theirname.'<br><b>Your Email:</b> '.$theiremail.'<br><b>The Property:</b> '.$property.'</p><p><b>Your Message:</b><br>'.$anecdote.'</p><hr><p><b>Error message:</b><br>'.error_get_last().'</p></body></html>';
    }
  } else {
    // This message is likely spam — Treat it with a generic success message
    error_log('Mailer.php — This message was likely spam so a fake Thank You message was provided');
    echo '<!doctype HTML><html lang="en"><head><title>Thanks | ArtInRuins</title><meta charset="utf-8"><meta http-equiv="refresh" content="15;url=/property/'.$property.'"><link rel="stylesheet" type="text/css" href="/assets/css/main.css"><link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png"></head><body class="content rhythm u__vertical__p u__gutter__p"><h1>Thank you</h1><p>Your message has been sent.</p></body></html>';
  } 		
} else {
  // No post found
  error_log('Mailer.php — No post was found at all');
  echo '<!doctype HTML><html lang="en"><head><title>No post | ArtInRuins</title><meta charset="utf-8"><link rel="stylesheet" type="text/css" href="/assets/css/main.css"><link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png"></head><body class="content rhythm u__vertical__p u__gutter__p"><h1>No post found</h1><p>Incomplete form submission (required fields not supplied).</body></html>';
} 
?>

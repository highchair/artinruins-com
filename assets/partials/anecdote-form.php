<?php
date_default_timezone_set('America/New_York');
// Signed timestamp: mailer.php verifies the HMAC, so the time cannot be forged.
// Secret lives OUTSIDE the web root (never in the repo): ~/.artinruins-form-secret
$secretFile = dirname($_SERVER['DOCUMENT_ROOT']) . '/.artinruins-form-secret';
$secret = is_readable($secretFile) ? trim(file_get_contents($secretFile)) : '';
$ts = time();
$token = ( strlen($secret) >= 32 ) ? hash_hmac('sha256', (string) $ts, $secret) : '';
if ( $token === '' ) {
  error_log('anecdote-form.php — Secret file missing or too short: ' . $secretFile);
}
header('Cache-Control: no-store');
?>
      <fieldset> 
        <legend class="u__sr-only">Send us your anecdote</legend>
        <div class="form__group__wrapper">
          <div class="form__group">
            <label for="name">Your Name:</label>
            <input id="name" name="name" type="text" class="form__input form__input--text" placeholder="First and Last, please" maxlength="100" required>
          </div>
          <div class="form__group">
            <label for="email">Your Email:</label>
            <input id="email" name="email" type="email" class="form__input form__input--email" placeholder="you@domain.com" maxlength="254" required>
          </div>
        </div>
        <div class="form__group form__pollen">
        	<label for="website">Website:</label>
        	<input id="website" name="website" type="url" class="form__url form__input--url" placeholder="http://www.domain.com" tabindex="-1" autocomplete="off">
        </div>
        <div class="form__group">
        	<label for="message">Anecdote:</label>
        	<textarea name="message" id="message" class="form__input--area" placeholder="Tell us your anecdote" rows="5" maxlength="5000" required></textarea>
        </div>
        <input type="hidden" id="timestamp" name="timestamp" value="<?php echo $ts; ?>">
        <input type="hidden" id="token" name="token" value="<?php echo $token; ?>">
      </fieldset>
    	
    	<div class="form__submit__group">
        <input name="submit" id="submit" type="submit" value="Submit Anecdote" class="form__submit btn btn--primary">
          &nbsp; 
      	<input name="reset" type="reset" id="reset" value="Clear form" class="form__submit btn btn--ghost">
    	</div>

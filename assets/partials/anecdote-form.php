<?php date_default_timezone_set('America/New_York'); ?>
      <fieldset> 
        <legend class="u__sr-only">Send us your anecdote</legend>
        <div class="form__group__wrapper">
          <div class="form__group">
            <label for="name">Your Name:</label>
            <input id="name" name="name" type="text" class="form__input form__input--text" placeholder="First and Last, please" required>
          </div>
          <div class="form__group">
            <label for="email">Your Email:</label>
            <input id="email" name="email" type="email" class="form__input form__input--email" placeholder="you@domain.com" required>
          </div>
        </div>
        <div class="form__group form__pollen">
        	<label for="website">Website:</label>
        	<input id="website" name="website" type="url" class="form__url form__input--url" placeholder="http://www.domain.com" tabindex="-1">
        </div>
        <div class="form__group">
        	<label for="name">Anecdote:</label>
        	<textarea name="message" id="message" class="form__input--area" placeholder="Tell us your anecdote" rows="5" required></textarea>
        </div>
        <input type="hidden" id="timestamp" name="timestamp" value="<?php echo date( 'YmdHis' ) ?>">
      </fieldset>
    	
    	<div class="form__submit__group">
        <input name="submit" id="submit" type="submit" value="Submit Anecdote" class="form__submit btn btn--primary">
          &nbsp; 
      	<input name="reset" type="reset" id="reset" value="Clear form" class="form__submit btn btn--ghost">
    	</div>

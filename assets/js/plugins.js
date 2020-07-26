// Concatenate any needed JS files here
window.addEventListener('load', function(){
  window.cookieconsent.initialise({
   revokeBtn: "<div class='cc-revoke'></div>",
   type: "opt-in",
   content: {
       message: "We use 3rd-party cookies from Google Analytics to track usage of this website. Data is stored anonymously for 6 months.",
       link: "More about cookies",
       allow: "Allow",
       deny: "Do Not Allow",
       href: "https://2gdpr.com/cookies"
    },
    onInitialise: function(status) {
      if(status == cookieconsent.status.allow) optInScripts();
    },
    onStatusChange: function(status) {
      if (this.hasConsented()) optInScripts();
    }
  })
});

function optInScripts() {
  // Paste your scripts that use cookies requiring consent
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-817925-2', 'auto');
  ga('send', 'pageview');
}

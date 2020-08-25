// 2592000000ms is 30 days
https:(function(root,factory,undefined){'use strict';if(typeof define==='function'&&define.amd){define([],factory);}else if(typeof exports==='object'){module.exports=factory();}else{root.CookiesEuBanner=factory();}}(window,function(){'use strict';var CookiesEuBanner,document=window.document;CookiesEuBanner=function(launchFunction,waitAccept,useLocalStorage,undefined){if(!(this instanceof CookiesEuBanner)){return new CookiesEuBanner(launchFunction);}
this.cookieTimeout=2592000000;this.bots=/bot|crawler|spider|crawling/i;this.cookieName='hasConsent';this.trackingCookiesNames=['__utma','__utmb','__utmc','__utmt','__utmv','__utmz','_ga','_gat','_gid'];this.launchFunction=launchFunction;this.waitAccept=waitAccept||false;this.useLocalStorage=useLocalStorage||false;this.init();};CookiesEuBanner.prototype={init:function(){var isBot=this.bots.test(navigator.userAgent);var dnt=navigator.doNotTrack||navigator.msDoNotTrack||window.doNotTrack;var isToTrack=(dnt!==null&&dnt!==undefined)?(dnt&&dnt!=='yes'&&dnt!==1&&dnt!=='1'):true;if(isBot||!isToTrack||this.hasConsent()===false){this.removeBanner(0);return false;}
if(this.hasConsent()===true){this.launchFunction();return true;}
this.showBanner();if(!this.waitAccept){this.setConsent(true);}},showBanner:function(){var _this=this,getElementById=document.getElementById.bind(document),banner=getElementById('cookies-eu-banner'),rejectButton=getElementById('cookies-eu-reject'),acceptButton=getElementById('cookies-eu-accept'),moreLink=getElementById('cookies-eu-more'),waitRemove=(banner.dataset.waitRemove===undefined)?0:parseInt(banner.dataset.waitRemove),addClickListener=this.addClickListener,removeBanner=_this.removeBanner.bind(_this,waitRemove);banner.style.display='block';if(moreLink){addClickListener(moreLink,function(){_this.deleteCookie(_this.cookieName);});}
if(acceptButton){addClickListener(acceptButton,function(){removeBanner();_this.setConsent(true);_this.launchFunction();});}
if(rejectButton){addClickListener(rejectButton,function(){removeBanner();_this.setConsent(false);_this.trackingCookiesNames.map(_this.deleteCookie);});}},setConsent:function(consent){if(this.useLocalStorage){return localStorage.setItem(this.cookieName,consent);}
this.setCookie(this.cookieName,consent);},hasConsent:function(){var cookieName=this.cookieName;var isCookieSetTo=function(value){return document.cookie.indexOf(cookieName+'='+value)>-1||localStorage.getItem(cookieName)===value;};if(isCookieSetTo('true')){return true;}else if(isCookieSetTo('false')){return false;}
return null;},setCookie:function(name,value){var date=new Date();date.setTime(date.getTime()+this.cookieTimeout);document.cookie=name+'='+value+';expires='+date.toGMTString()+';path=/';},deleteCookie:function(name){var hostname=document.location.hostname.replace(/^www\./,''),commonSuffix='; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';document.cookie=name+'=; domain=.'+hostname+commonSuffix;document.cookie=name+'='+commonSuffix;},addClickListener:function(DOMElement,callback){if(DOMElement.attachEvent){return DOMElement.attachEvent('onclick',callback);}
DOMElement.addEventListener('click',callback);},removeBanner:function(wait){var banner=document.getElementById('cookies-eu-banner');banner.classList.add('cookies-eu-banner--before-remove');setTimeout(function(){if(banner&&banner.parentNode){banner.parentNode.removeChild(banner);}},wait);}};return CookiesEuBanner;}));

// Set up the Cookie Consent Banner
new CookiesEuBanner(function () {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-817925-2', 'auto');
  ga('send', 'pageview');
}, true);

// If JS is loaded, change the body class
document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.remove("no-js");
  document.body.classList.add("js");
  
  // Remove the aria-hidden from the cookie banner
  document.getElementById("cookies-eu-banner").setAttribute("aria-hidden", "false");
  
  // Check all external anchors and add a title
  const extanchors = document.querySelectorAll('[target="_blank"]');
	extanchors.forEach(anchor => {
	  anchor.setAttribute("title", "Opens in a new window");
	  anchor.setAttribute("rel", "noopener noreferrer");
	});
});

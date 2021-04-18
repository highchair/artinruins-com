---
permalink: assets/js/property.js
---

// List out all properties into an array
{%- assign properties = site.property | sort: "date-added" | reverse -%}
{% if properties.size > 0 %}
var allProps = [
  {%- for property in properties -%}
    {%- if property.title and property.slug and property.date-modified -%}
  "{{ property.slug }}",
    {%- endif -%}
  {%- endfor -%}
]
{% endif %}
var randomItem = allProps[Math.floor(Math.random()*allProps.length)];


document.addEventListener("DOMContentLoaded", function() {
  // Property pages
  // Turn certain buttons into a toggler for a viewable pane
  var jumper = document.querySelector('#jump-trigger');
  if (jumper !== null && jumper !== '') {
    jumper.addEventListener('click', function (e) {
      var expanded = jumper.getAttribute('aria-expanded');
      // If closes, open it
      if (expanded == 'false') {
        jumper.setAttribute('aria-expanded', 'true');
      }
      // If open, close it
      if (expanded == 'true') {
        jumper.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // Property pages
  // If anything inside of the jump menu is clicked, close the menu
  var links_within = document.querySelectorAll('.jumper__link');
  if (links_within !== null && links_within !== '') {
    links_within.forEach(function(link) {
      link.addEventListener('click', function(l) {
        jumper.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Property pages
  // Clone the jump menu and move the copy
  var jumpList = document.querySelector('#jump-list');
  if (jumpList !== null && jumpList !== '') {
    var jumpListClone = jumpList.cloneNode(true);
    // Create a new element to house the clone
    var divWrapper = document.createElement('div');
    divWrapper.classList.add('jumper--in-content');
    divWrapper.setAttribute('aria-hidden', 'true');
    divWrapper.classList.add('u__vertical__p');
    var newNav = document.createElement('nav');
    newNav.classList.add('jumper__wrapper');
    newNav.setAttribute('aria-label', 'Page');
    // Inject a label
    newNav.innerHTML = '<span class="jumper__toggler__text">Jump to a section:</span>';
    newNav.append(jumpListClone);
    divWrapper.append(newNav);
    // Insert in the page after the gallery element
    var gallery = document.querySelector('#gallery');
    gallery.after(divWrapper);
  }
  
  // Property pages
  // Load the anecdote form immediately if someone clicks the loader button
  var anecdoteButton = document.getElementById('js__load-form');
  if (anecdoteButton !== null && anecdoteButton !== '') {
    anecdoteButton.addEventListener('click', function(j) {
      loadAnecdoteForm();
    });
  }
  
  // Randomly assign a "Surprise Me" link one of our properties
  // <a class="prev-next__surprise" href="#">Surprise Me <span aria-hidden="true">!</span></a>
  var surprise = document.getElementById('js-random');
  if (surprise !== null && surprise !== '') {
    var a = document.createElement('a');
    a.innerHTML = ('Surprise Me <span aria-hidden="true">!</span>');
    a.href = "{{ site.baseurl }}property/" + randomItem;
    surprise.appendChild(a);
  }
  
  // The Property Gallery is initialized by HTML on the page, i.e. "data-fslightbox"
  fsLightboxInstances['air-lightbox'].props.slideshowTime = 6000;
  fsLightboxInstances['air-lightbox'].props.zoomIncrement = 1.0;
});

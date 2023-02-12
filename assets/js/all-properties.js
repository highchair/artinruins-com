---
permalink: assets/js/all-properties.js
---

// List out all properties into an array
{%- assign properties = site.property | sort: "title" -%}
{% if properties.size > 0 %}
const allProps = [
  {%- for property in properties -%}
    {%- if property.title -%}
      {%- if property.thumbnail -%}
        {%- assign item_image = property.thumbnail -%}
      {%- else -%}
        {%- assign item_image = property.images.first.url -%}
      {%- endif -%}
      {%- assign categories = property.categories -%}
      {%- capture is_notthere -%}
        {% if categories contains '#ArchiveRI' %}<b>#ArchiveRI</b> — {% else %}{% endif %}
      {%- endcapture -%}
      {%- capture is_notthere -%}
        {% if categories contains '#UsedToBeThere' %}<b>#UsedToBeThere</b> — {% else %}{% endif %}
      {%- endcapture -%}
  {
    slug: '{{ property.slug }}', title: '{{ property.title }}',
    {%- if item_image.size > 0 -%}
    imgpath: '<img src="{{ site.propimg_path }}r/480/{{ item_image }}" class="rwd-img" alt="" loading="lazy" decoding="async" />',
    excerpt: '{{ is_notthere }}{{ property.excerpt | escape_once }}'
    {%- endif -%}{% if property.latitude != '' and property.latitude != null %},
    lat: {{ property.latitude }},
    lng: {{ property.longitude }}{% endif %}
  }{% unless forloop.last %},{% endunless %}
    {%- endif -%}
  {%- endfor -%}
];
{% endif %}
const randomItem = allProps[Math.floor(Math.random()*allProps.length)];

document.addEventListener("DOMContentLoaded", function() {
  // Property pages
  // Turn certain buttons into a toggler for a viewable pane
  const jumper = document.querySelector('#jump-trigger');
  if (jumper !== null && jumper !== '') {
    jumper.addEventListener('click', function (e) {
      let expanded = jumper.getAttribute('aria-expanded');
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
  const links_within = document.querySelectorAll('.jumper__link');
  if (links_within !== null && links_within !== '') {
    links_within.forEach(function(link) {
      link.addEventListener('click', function(l) {
        jumper.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Property & Then-Now pages
  // Clone the jump menu and move the copy
  const jumpList = document.querySelector('#jump-list');
  if (jumpList !== null && jumpList !== '') {
    let jumpListClone = jumpList.cloneNode(true);
    // Create a new element to house the clone
    let divWrapper = document.createElement('div');
    divWrapper.classList.add('jumper--in-content');
    divWrapper.setAttribute('aria-hidden', 'true');
    divWrapper.classList.add('u__vertical__p');
    let newNav = document.createElement('nav');
    newNav.classList.add('jumper__wrapper');
    newNav.setAttribute('aria-label', 'Page');
    // Inject a label
    newNav.innerHTML = '<span class="jumper__toggler__text">Jump to a section:</span>';
    newNav.append(jumpListClone);
    divWrapper.append(newNav);
    // Insert in the page after the gallery element
    let gallery = document.querySelector('#gallery');
    gallery.after(divWrapper);
  }

  // Randomly assign a "Surprise Me" link one of our properties
  // <a class="prev-next__surprise" href="#">Surprise Me <span aria-hidden="true">!</span></a>
  const surprise = document.getElementById('js-random');
  if (surprise !== null && surprise !== '') {
    let a = document.createElement('a');
    a.id = '#gtm-surprise-trigger';
    a.innerHTML = ('Surprise Me <span aria-hidden="true">!</span>');
    a.href = "/property/" + randomItem.slug;
    surprise.appendChild(a);
  }
});

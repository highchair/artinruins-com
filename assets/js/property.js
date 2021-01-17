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

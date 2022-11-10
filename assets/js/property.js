---
permalink: assets/js/property.js
---

// List out all properties into an array
{%- assign properties = site.property | sort: "date-added" | reverse -%}
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

// Trigonometric function to take two coordinate sets and calculates the distance between them
function distance(lat1, lon1, lat2, lon2, unit) {
  let radlat1 = Math.PI * lat1/180
  let radlat2 = Math.PI * lat2/180
  let theta = lon1-lon2
  let radtheta = Math.PI * theta/180
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="M") { dist = dist * 0.8684 }
  return dist
}

// Convert miles to feet
function convertMilesToFeet(miles) {
  return Math.round(miles * 5280);
}

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

  // Property pages
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

  // Property pages
  // Load the anecdote form immediately if someone clicks the loader button
  const anecdoteButton = document.getElementById('js__load-form');
  if (anecdoteButton !== null && anecdoteButton !== '') {
    anecdoteButton.addEventListener('click', function(j) {
      loadAnecdoteForm();
    });
    // Load the form only after 10 seconds have past
    // BUT not if someone has clicked the button to load it manually (see function above)
    var executeLoadAnecdoteForm = setTimeout(loadAnecdoteForm, 10000);
  }

  // Randomly assign a "Surprise Me" link one of our properties
  // <a class="prev-next__surprise" href="#">Surprise Me <span aria-hidden="true">!</span></a>
  const surprise = document.getElementById('js-random');
  if (surprise !== null && surprise !== '') {
    let a = document.createElement('a');
    a.innerHTML = ('Surprise Me <span aria-hidden="true">!</span>');
    a.href = "/property/" + randomItem.slug;
    surprise.appendChild(a);
  }

  // The Property Gallery is initialized by HTML on the page, i.e. "data-fslightbox"
  fsLightboxInstances['air-lightbox'].props.slideshowTime = 6000;
  fsLightboxInstances['air-lightbox'].props.zoomIncrement = 1.0;


  // Find nearest locations to a current property
  const nearby = document.getElementById('js-nearby');
  if (nearby !== null && nearby !== '') {
    let proplat = nearby.getAttribute('data-latitude');
    let proplng = nearby.getAttribute('data-longitude');
    let html = '';
    let found = false;
    var nearprops = [];

    for (let i = 0; i < allProps.length; i++) {
      // if this location is within 0.25m of the user, add it to the list
      let thisprop = allProps[i];
      let dist = distance(proplat, proplng, thisprop.lat, thisprop.lng, "M");
      if ( dist <= 0.25) {
        // Check to make sure this property doesn't match itself
        if (proplat != thisprop.lat) {
          let workingCopy = {};
          workingCopy.title = thisprop.title;
          workingCopy.distance = dist;
          workingCopy.imgpath = thisprop.imgpath;
          workingCopy.slug = thisprop.slug;
          workingCopy.excerpt = thisprop.excerpt;
          nearprops[i] = workingCopy;
          found = true;
        }
      }
    }
    if (found) {
      // Sort by shortest distance
      let byDistance = nearprops.slice(0);
      byDistance.sort(function(a,b) {
        return (a.distance < b.distance) ? -1 : 1;
      });
      // Limit the output
      const limit = 6;
      let count = (Object.keys(byDistance).length > limit) ? limit : Object.keys(byDistance).length;
      html += '<h2 class="o__title--sm v-rhythm">' + count + ' Properties Nearby (within 1/4 mile)</h2><ul class="taxonomy__list taxonomy__list--vertical taxonomy__list--vertical--' + count + ' u__list__unstyled u__vertical__pb" role="list">';
      let max = 0;

      for (let key in byDistance) {
        if (max < limit) {
          html += '<li><div class="taxonomy__img-wrap">' + byDistance[key].imgpath + '</div><div class="taxonomy__colwrap"><div class="taxonomy__title-wrap"><h3 class="h5 taxonomy__card-title"><a href="/property/' + byDistance[key].slug + '" class="taxonomy__link">' + byDistance[key].title + '</a></h3><p class="taxonomy__excerpt">' + byDistance[key].excerpt + '</p><p><i>' + convertMilesToFeet(byDistance[key].distance) + ' feet away</i></p></div></div></li>';
          max++;
        } else {
          break;
        }
      }
      nearby.innerHTML = html + '</ul>';
    }
  }
});

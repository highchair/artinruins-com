// Property map prototype — MapLibre GL + Protomaps (self-hosted PMTiles, fonts, sprites)
import * as maplibregl from '/assets/map/lib/maplibre-gl-6.15.0/maplibre-gl.mjs';

const el = document.getElementById('js-map');
const status = document.getElementById('js-map-status');
const origin = window.location.origin;

// Marker colors by first #Category. The category toggles are colored from this same list.
const COLORS = {
  '#NotInRuins': '#2b7a3d',
  '#WhatAreTheyBuilding': '#1f5fae',
  '#UrbanDecay': '#b0412e',
  '#DemolitionAlert': '#c27c00',
  '#UsedToBeThere': '#5c5c5c',
  '#ArchiveRI': '#8a5a2b',
  other: '#4d4d4d'
};

// Categories that can no longer be seen in person get hollow markers (white fill, colored ring)
const HOLLOW = ['#UsedToBeThere', '#ArchiveRI'];

// The category checkboxes in map.html decide what is shown; their "checked" attribute is the default
const boxes = Array.from(document.querySelectorAll('.js-map-category'));

let basemapProblem = '';
function setStatus(text) {
  if (status) status.textContent = [text, basemapProblem].filter(Boolean).join(' ');
}

// A feature is shown when any of its categories is checked. "cats" looks like |#A|#B|
function checkedCategories() {
  return boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
}
function categoryFilter(checked) {
  if (!checked.length) return ['==', ['get', 'cats'], '__none__'];
  return ['any'].concat(checked.map(function (c) { return ['in', '|' + c + '|', ['get', 'cats']]; }));
}
function isShown(feature, checked) {
  return checked.some(function (c) { return feature.properties.cats.indexOf('|' + c + '|') !== -1; });
}

// - - - Places near me (opt-in geolocation) - - -
const near = document.querySelector('.js-map-near');
const nearBtn = document.querySelector('.js-map-near-btn');
const nearResults = document.querySelector('.js-map-near-results');
const NEAR_COUNT = 5;

// Location needs browser support and a secure page (https, or localhost while developing). The site's
// Permissions-Policy header must allow it too: geolocation=(self) in .htaccess. Chromium browsers can
// report that policy; others are checked when the visitor presses the button.
function geolocationAvailable() {
  if (!('geolocation' in navigator) || !window.isSecureContext) return false;
  const policy = document.permissionsPolicy || document.featurePolicy;
  if (policy && typeof policy.allowsFeature === 'function' && !policy.allowsFeature('geolocation')) return false;
  return true;
}
function nearMessage(text) {
  nearResults.textContent = '';
  const p = document.createElement('p');
  p.textContent = text;
  nearResults.appendChild(p);
}
// Straight-line distance in meters between two [lng, lat] points (haversine)
function distance(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLng = (b[0] - a[0]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}
function formatDistance(m) {
  const ft = m * 3.28084;
  if (ft < 528) return Math.max(10, Math.round(ft / 10) * 10) + ' ft';
  return (ft / 5280).toFixed(1) + ' mi';
}

if (el && window.pmtiles && window.basemaps) {
  // Register the pmtiles:// protocol so MapLibre can read tiles from one static file via HTTP range requests
  const protocol = new pmtiles.Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);

  // Basemap is optional: without a tiles path (map_tiles in _config.yml) only the markers are drawn
  const tiles = el.dataset.tiles;
  const style = {
    version: 8,
    glyphs: origin + '/assets/map/fonts/{fontstack}/{range}.pbf',
    sprite: origin + '/assets/map/sprites/light',
    sources: {},
    layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#e9e6df' } }]
  };
  if (tiles) {
    // Local dev only: `jekyll serve` (WEBrick) answers the browser's cache revalidation of a byte-range
    // request with 304 instead of 206, which PMTiles treats as an error. Bypass the browser cache locally.
    // (Uses FetchSource's no-store switch, pinned to pmtiles 4.5.0.)
    if (['127.0.0.1', 'localhost'].includes(window.location.hostname)) {
      const source = new pmtiles.FetchSource(origin + tiles);
      source.chromeWindowsNoCache = true;
      protocol.add(new pmtiles.PMTiles(source));
    }
    style.sources.protomaps = {
      type: 'vector',
      url: 'pmtiles://' + origin + tiles,
      attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    };
    style.layers = basemaps.layers('protomaps', basemaps.namedFlavor('light'), { lang: 'en' });
  } else {
    basemapProblem = 'The basemap is not configured (map_tiles in _config.yml).';
  }

  // Keep the view inside the area the basemap covers (map_bounds in _config.yml: west, south, east, north)
  let maxBounds;
  try {
    const b = JSON.parse(el.dataset.bounds || 'null');
    if (Array.isArray(b) && b.length === 4) maxBounds = [[b[0], b[1]], [b[2], b[3]]];
  } catch (err) { /* no bounds: the map can be panned freely */ }

  const map = new maplibregl.Map({
    container: el,
    center: [-71.4128, 41.8240], // Downtown Providence
    zoom: 12.5,
    minZoom: 8,
    maxZoom: 18,
    maxBounds: maxBounds,
    attributionControl: { compact: true },
    style: style
  });

  // Full screen toggle sits above the zoom buttons (top-right controls stack in the order they are added).
  // It enlarges the wrapper, not just the map, so the category checkboxes stay usable in full screen.
  map.addControl(new maplibregl.FullscreenControl({ container: el.closest('.map__wrapper') || el }), 'top-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

  // Places near me: a location button below the zoom buttons, plus the text button under the map.
  // Nothing asks for the visitor's location until they press one of them.
  let geolocate = null;
  if (near && geolocationAvailable()) {
    geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
      trackUserLocation: false, // one reading per press; press again to update
      fitBoundsOptions: { maxZoom: 17 } // zoom in close around the visitor
    });
    map.addControl(geolocate, 'top-right');
    near.hidden = false;
  }

  map.on('error', function (e) {
    const msg = (e && e.error && e.error.message) || '';
    if (/pmtiles|range|404|fetch/i.test(msg) && !basemapProblem) {
      basemapProblem = 'The basemap could not be loaded.';
      setStatus(status ? status.textContent : '');
    }
    console.warn('[map]', msg);
  });

  map.on('load', async function () {
    let data;
    try {
      const res = await fetch(el.dataset.points);
      data = await res.json();
    } catch (err) {
      setStatus('Property locations could not be loaded.');
      return;
    }

    map.addSource('properties', { type: 'geojson', data: data });

    // Expression helpers: category color, and whether the marker is hollow
    const colorMatch = ['match', ['get', 'category']];
    Object.keys(COLORS).forEach(function (k) { if (k !== 'other') colorMatch.push(k, COLORS[k]); });
    colorMatch.push(COLORS.other);
    const hollow = ['in', ['get', 'category'], ['literal', HOLLOW]];

    map.addLayer({
      id: 'properties',
      type: 'circle',
      source: 'properties',
      filter: categoryFilter(checkedCategories()),
      layout: {
        // Draw hollow (gone/historical) markers underneath the solid ones
        'circle-sort-key': ['case', hollow, 0, 1]
      },
      paint: {
        'circle-color': ['case', hollow, '#ffffff', colorMatch],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 13, 5, 16, 8],
        'circle-stroke-color': ['case', hollow, colorMatch, '#ffffff'],
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 10, ['case', hollow, 1.5, 1], 16, ['case', hollow, 3, 2]]
      }
    });

    // Show how many places each checkbox controls
    boxes.forEach(function (b) {
      const n = data.features.filter(function (f) { return f.properties.cats.indexOf('|' + b.value + '|') !== -1; }).length;
      const count = document.querySelector('.map__count[data-category="' + b.value + '"]');
      if (count) count.textContent = '(' + n + ')';
    });

    function update() {
      const checked = checkedCategories();
      map.setFilter('properties', categoryFilter(checked));
      const shown = data.features.filter(function (f) { return isShown(f, checked); }).length;
      setStatus(shown + ' of ' + data.features.length + ' places shown.');
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();

    // List the closest places (in the categories that are turned on) after the visitor shares their location
    if (geolocate) {
      let here = null; // [lng, lat] of the latest reading

      function showNearest() {
        const checked = checkedCategories();
        const nearest = data.features
          .filter(function (f) { return isShown(f, checked); })
          .map(function (f) { return { f: f, d: distance(here, f.geometry.coordinates) }; })
          .sort(function (a, b) { return a.d - b.d; })
          .slice(0, NEAR_COUNT);
        if (!nearest.length) {
          nearMessage('No categories are turned on. Turn one on to see places near you.');
          return;
        }
        nearResults.textContent = '';
        const title = document.createElement('h2');
        title.className = 'map__near__title';
        title.textContent = 'Closest places to you';
        const list = document.createElement('ol');
        list.className = 'map__near__list';
        nearest.forEach(function (n) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = n.f.properties.url;
          a.textContent = n.f.properties.title;
          const dist = document.createElement('span');
          dist.className = 'map__near__dist';
          dist.textContent = formatDistance(n.d);
          li.appendChild(a);
          li.appendChild(document.createTextNode(' '));
          li.appendChild(dist);
          list.appendChild(li);
        });
        nearResults.appendChild(title);
        nearResults.appendChild(list);
      }

      nearBtn.disabled = false;
      nearBtn.addEventListener('click', function () {
        nearMessage('Finding your location…');
        geolocate.trigger();
      });
      geolocate.on('geolocate', function (pos) {
        here = [pos.coords.longitude, pos.coords.latitude];
        nearBtn.querySelector('.js-map-near-label').textContent = 'Update places near me';
        showNearest();
      });
      geolocate.on('outofmaxbounds', function () {
        here = null;
        nearMessage('You appear to be outside the area this map covers, so there are no places to show near you.');
      });
      geolocate.on('error', function (err) {
        here = null;
        nearMessage(err && err.code === 1
          ? 'Location access was not allowed. To use this, allow location for this site in your browser settings, then try again.'
          : 'Your location could not be found just now. Please try again.');
      });
      // Keep the list in step with the category toggles
      boxes.forEach(function (b) { b.addEventListener('change', function () { if (here) showNearest(); }); });
    }

    map.on('mouseenter', 'properties', function () { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'properties', function () { map.getCanvas().style.cursor = ''; });

    map.on('click', 'properties', function (e) {
      const f = e.features[0];
      const p = f.properties;
      // Build the popup with DOM methods (no innerHTML) so property text can never inject markup
      const box = document.createElement('div');
      box.className = 'map__popup';
      if (p.img) {
        const img = document.createElement('img');
        img.src = p.img;
        img.alt = '';
        img.loading = 'lazy';
        img.className = 'map__popup__img';
        box.appendChild(img);
      }
      const a = document.createElement('a');
      a.href = p.url;
      a.textContent = p.title;
      a.className = 'map__popup__title';
      box.appendChild(a);
      if (p.address) {
        const addr = document.createElement('p');
        addr.textContent = p.address;
        box.appendChild(addr);
      }
      const cats = (p.cats || '').split('|').filter(Boolean);
      if (cats.length) {
        const cat = document.createElement('p');
        cat.textContent = cats.join(', ');
        cat.className = 'map__popup__cat';
        box.appendChild(cat);
      }
      new maplibregl.Popup({ maxWidth: '260px' })
        .setLngLat(f.geometry.coordinates.slice())
        .setDOMContent(box)
        .addTo(map);
    });
  });

  // Color the category toggles from the same list as the markers (map.css reads --cat)
  document.querySelectorAll('.map__chip').forEach(function (c) {
    const cat = c.dataset.category;
    c.style.setProperty('--cat', COLORS[cat] || COLORS.other);
    if (HOLLOW.indexOf(cat) !== -1) c.classList.add('map__chip--hollow');
  });
} else if (el) {
  setStatus('The map could not start.');
}

// Property map prototype — MapLibre GL + Protomaps (self-hosted PMTiles, fonts, sprites)
import * as maplibregl from '/assets/map/lib/maplibre-gl-6.15.0/maplibre-gl.mjs';

const el = document.getElementById('js-map');
const status = document.getElementById('js-map-status');
const origin = window.location.origin;

// Marker colors by first #Category. Legend swatches are colored from this same list.
const COLORS = {
  '#NotInRuins': '#2b7a3d',
  '#WhatAreTheyBuilding': '#1f5fae',
  '#UrbanDecay': '#b0412e',
  '#DemolitionAlert': '#c27c00',
  other: '#4d4d4d'
};

let basemapProblem = '';
function setStatus(text) {
  if (status) status.textContent = [text, basemapProblem].filter(Boolean).join(' ');
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

  const map = new maplibregl.Map({
    container: el,
    center: [-71.4128, 41.8240], // Downtown Providence
    zoom: 12.5,
    minZoom: 8,
    maxZoom: 18,
    attributionControl: { compact: true },
    style: style
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

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

    const colorMatch = ['match', ['get', 'category']];
    Object.keys(COLORS).forEach(function (k) { if (k !== 'other') colorMatch.push(k, COLORS[k]); });
    colorMatch.push(COLORS.other);

    map.addLayer({
      id: 'properties',
      type: 'circle',
      source: 'properties',
      paint: {
        'circle-color': colorMatch,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 13, 5, 16, 8],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 2]
      }
    });

    setStatus(data.features.length + ' properties shown.');

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
      if (p.category) {
        const cat = document.createElement('p');
        cat.textContent = p.category;
        cat.className = 'map__popup__cat';
        box.appendChild(cat);
      }
      new maplibregl.Popup({ maxWidth: '260px' })
        .setLngLat(f.geometry.coordinates.slice())
        .setDOMContent(box)
        .addTo(map);
    });
  });

  // Color the legend from the same list as the markers
  document.querySelectorAll('.map__swatch').forEach(function (s) {
    s.style.backgroundColor = COLORS[s.dataset.category] || COLORS.other;
  });
} else if (el) {
  setStatus('The map could not start.');
}

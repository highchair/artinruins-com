# Map assets (prototype)

Used by `/map/` (`map.html`). Everything is self-hosted; no third-party map requests.

| Path | What | Source / License |
|---|---|---|
| `lib/maplibre-gl-6.15.0/` | MapLibre GL JS 6.15.0 (ES module + worker + CSS) | npm `maplibre-gl`, BSD-3-Clause |
| `lib/pmtiles-4.5.0.js` | PMTiles reader 4.5.0 (global `pmtiles`) | npm `pmtiles`, BSD-3-Clause |
| `lib/basemaps-5.7.2.js` | Protomaps basemap styles 5.7.2 (global `basemaps`) | npm `@protomaps/basemaps`, BSD-3-Clause |
| `fonts/` | Glyph PBFs: Noto Sans Regular/Medium/Italic | github.com/protomaps/basemaps-assets, SIL OFL (`fonts/OFL.txt`) |
| `sprites/light*` | Protomaps v4 "light" sprite sheet | github.com/protomaps/basemaps-assets |
| `tiles/providence-YYYYMMDD.pmtiles` | Basemap tiles, Providence metro extract | Protomaps daily build of OpenStreetMap data (ODbL) — attribution required |
| `properties.json` | GeoJSON of properties (Jekyll-generated) | — |
| `map.js`, `map.css` | Page script and styles | — |

## Not in git

`tiles/` and `fonts/` are listed in `.gitignore` because they are large and easy to recreate.
After a fresh clone, restore them before building:

- **Tiles:** follow "Regenerate the basemap extract" below.
- **Fonts:** download github.com/protomaps/basemaps-assets (Code → Download ZIP) and copy
  `fonts/Noto Sans Regular`, `fonts/Noto Sans Medium`, `fonts/Noto Sans Italic`, and `fonts/OFL.txt`
  into `assets/map/fonts/`.

Then copy both into the build folders (see "Build speed" below).

## Regenerate the basemap extract

1. Download the `pmtiles` CLI for your Mac from https://github.com/protomaps/go-pmtiles/releases
2. Pick a recent build date from https://maps.protomaps.com/builds/
3. Run (from the repo root):

```
pmtiles extract https://build.protomaps.com/YYYYMMDD.pmtiles assets/map/tiles/providence-YYYYMMDD.pmtiles --bbox=-71.60,41.70,-71.30,41.95 --maxzoom=15
```

4. Update `map_tiles` in `_config.yml` to the new filename, delete the old file.
5. Copy it into the build folders (see below).

## Build speed: fonts, sprites, and tiles are not processed by Jekyll

`fonts/`, `sprites/`, and `tiles/` are listed under `exclude` in `_config.yml` (Jekyll skips them)
and under `keep_files` (Jekyll never deletes them from the build folder). Copy them into each build
folder once, and again only when they change:

```
rsync -a assets/map/fonts assets/map/sprites assets/map/tiles _site/assets/map/
rsync -a assets/map/fonts assets/map/sprites assets/map/tiles _stage/assets/map/
```

After deleting `_site/` or `_stage/` (a clean build), run the copy again. Upload these folders to
the server separately, the same way as `property-img/`.

## Upgrading libraries

Versioned file/folder names are the cache-busters. Install the new version from npm, copy the
`dist` files into a new versioned path, update the paths in `map.html` and `map.js`.

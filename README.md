ArtInRuins
==========

View the production site: [ArtInRuins](https://artinruins.com)

Locally generated static HTML site built via [Jekyll](https://jekyllrb.com/) with
[SASS](https://sass-lang.com/) and [Autoprefixer](https://github.com/vwochnik/jekyll-autoprefixer).

This repository serves as the archive of data collected from various public sources, including our massive photo collection of over 7000 images. These photos are downsized for web use. A personal archive is collected and organized by J. Hogue and will be donated to a public institution upon his death.

***

## Get started with Bundler

```bash
$ bundle install
# or
$ bundle update
```

## Serve the site locally

Includes a site HTML compile and SASS compile. Use the `incremental` flag to build
only the assets that have changed. The `JEKYLL_ENV` variable is assumed to be
"development" when omitted.

```bash
$ bundle exec jekyll serve --I
```

Builds into the Stage folder: `_stage`. When using the non-incremental build with `jekyll serve`, the first build will need
time to create ALL of the site thumbnails (two for every property on the site, currently over 400 properties).

In a browser, open [http://127.0.0.1:4090/](http://127.0.0.1:4090/)


## Build the Site for Production

Specify the production environment to omit content intended for development only.
Optionally, add the future flag to publish posts that have a future timestamp.

```bash
$ JEKYLL_ENV=production jekyll build --config _config.yml --I
```

Builds into the Production folder: `_stage`. Used so that we may conduct incremental
builds and only upload what has changed. The `property-img` folder is ignored with this command,
but incremental changes should be caught by an IDE’s publish difference engine.

### Supporting incremental builds

In order to build these 400+ property pages quickly, we insert development-only changes
via Javascript. The `/assets/js/global.js` file has front matter in it to become part
of the build process. If development, certain new scripts are added that change the
main navigation. **DO NOT upload this JS file to the Production site or you may put
development-only JS in place!**


## Custom post types (Collections)

ArtInRuins has configured custom “collections” (in Jekyll speak) called Properties (`_property`), 
Essays (`_essays`), and Then Nows (`_then-now`). These files are in Markdown format with substantial
FrontMatter to support taxonomy linking for designer, years built, year demolished, lists, location,
and more.


## Taxonomy pages

Taxonomies like neighborhoods, towns, designers, years built, etc. are actually HTML pages with extra 
Front Matter. Liquid queries find the properties associated with those bits of Front Matter.

Example:
```
# In _includes/project-category-loop.html the query retrieves a list of items that match type and category:
{%- assign items = site.property | where: page.type, page.category | sort: "title" -%}
```

For a “Date Added” page (`date-added/2002.html`) the Front Matter defines `type: date-added` and `category: '2002'`, 
therefore `items` will be an array of Properties `where: date-added, 2002`.

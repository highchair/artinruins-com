ArtInRuins
==========

View the production site: [ArtInRuins](//artinruins.com)

Locally generated static HTML site built via [Jekyll](//jekyllrb.com/) with 
[SASS](//sass-lang.com/) and [Autoprefixer](//github.com/vwochnik/jekyll-autoprefixer).

***

## Get started with Bundler

```bash
$ bundle install
```

## Serve the site locally

Includes a site HTML compile and SASS compile. Use the `incremental` flag to build 
only the assets that have changed. The `JEKYLL_ENV` variable is assumed to be 
"development" when omitted. 

```bash
$ jekyll serve --I
```

Builds into the Stage folder: `_stage`.

In a browser, open [http://127.0.0.1:4090/](http://127.0.0.1:4090/)


## Build the Site for Production

Specify the production environment to omit content intended for development only. 
Optionally, add the future flag to publish posts that have a future timestamp. 

```bash
$ JEKYLL_ENV=production jekyll build --config _config_prod.yml --I
```

Builds into the Production folder: `_stage`. Used so that we may conduct incremental 
builds and only upload what has changed. The `property-img` folder is ignored with this command,
but incremental changes should be caught by Nova’s Publish difference engine.

### Supporting incremental builds

In order to build these 300+ property pages quickly, we insert development-only changes
via Javascript. The `/assets/js/global.js` file has front matter in it to become part 
of the build process. If development, certain new scripts are added that change the 
main navigation. **DO NOT upload this JS file to the Production site or you may put 
development-only JS in place!** 

The Google Global Tag is also added via JS as part of the cookie policy acceptance.


## Custom post types (Collections)

ArtInRuins has configured a custom “collection” (in Jekyll speak) called Properties 
(`_property`). These files are in Markdown format with substantial FrontMatter to 
support taxonomy linking for designer, years built, year demolished, lists, location, 
and more. 


## Taxonomy pages

Taxonomies like neighborhoods, towns, designers, years built, etc… are actually 
just HTML pages with extra Front Matter. Liquid queries find the properties associated 
with those bits of Front Matter.

Example: 
```
# In _includes/project-category-loop.html
{%- assign items = site.property | where: page.type, page.category | sort: "title" -%}
```

For a “Date Added” page where `type: date-added` and `category: '2002'`, 
`items` will be an array of Properties where `date-added` == `2002`. 

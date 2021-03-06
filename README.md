ArtInRuins
==========

View the production site: [ArtInRuins](//artinruins.com)

Locally generated static HTML site built with [Jekyll](//jekyllrb.com/) with 
[SASS](//sass-lang.com/), and [Autoprefixer](//github.com/vwochnik/jekyll-autoprefixer).

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

**NOTE:** Certain files are not built during local development to keep build times 
speedy. Check the `_config.yml` file for a list of the pages that are excluded.


## Build the Site for Production

Specify the production environment to omit content intended for development only. 
Optionally, add the future flag to publish posts that have a future timestamp. 

```bash
$ JEKYLL_ENV=production jekyll build --config _config_prod.yml --I
```

Builds into the Production folder: `_prod`. Used so that we may conduct incremental 
builds and only upload what has changed. Will conditionally include the Google
Analytics tag in production build mode. 


## Custom post types (Collections)

ArtInRuins has configured a custom “collection” (in Jekyll speak) called Properties 
(`_property`). These files are in Markdown format with substantial FrontMatter to 
support taxonomy linking for designer, years built, year demolished, lists, location, 
and more. 


## Taxonomy pages

Taxonomies like neighborhoods, towns, designers, years built, etc… are actually 
just pages with extra Front Matter. Liquid queries get the properties associated 
with those bits of Front Matter.

Example: 
```
# In _includes/project-category-loop.html
{%- assign items = site.property | where: page.type, page.category | sort: "title" -%}
```

For a “Date Added” page where `type: date-added` and `category: '2002'`, 
`items` will be an array of Properties where `date-added` == `2002`. 

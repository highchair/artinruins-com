Highchair designhaus
====================

Locally generated static HTML site built with [Jekyll](https://jekyllrb.com/) with [SASS](https://sass-lang.com/), [Bootstrap 4.3](https://getbootstrap.com/docs/4.3/getting-started/introduction/), and [Autoprefixer](https://github.com/vwochnik/jekyll-autoprefixer).

**Built on Grey Matter from Oomph**. [Grey Matter](https://github.com/oomphinc/oomph-grey-matter) is a boilerplate scaffold for stand-alone Jekyll projects. Inspired by [Distillery](https://github.com/thinkshout/distillery/tree/master/) (and now heavily updated/modified), built and served with Jekyll, leveraging Oomph SASS Scaffold custom code and *Bootstrap 4*.


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

In a browser, open [http://127.0.0.1:4000/](http://127.0.0.1:4000/)

### Additional Flags

+ `--drafts` to publish/preview drafts
+ `--future` to publish/preview posts with a future date
+ `--unpublished` to publish/preview posts marked with unpublished


## Build the Site for Production

Specify the production environment to omit content intended for development only. 
Optionally, add the future flag to publish posts that have a future timestamp. 

```bash
$ JEKYLL_ENV=production jekyll build --config _config_prod.yml --i --future
```


## Categories

Categories are created by adding a file to the /category/ folder with Front Matter content. 
It is important that the Front Matter “category:” name matches the way posts use that Category. 
Capitalization is important! 


## Future Ideas

Add this JS later to turn headers into clickable/bookmarkable anchors?
http://blog.parkermoore.de/2014/08/01/header-anchor-links-in-vanilla-javascript-for-github-pages-and-jekyll/


* * *


You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext` and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
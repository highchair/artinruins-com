ITCSS: Inverted Triangle CSS
============================

From https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/
And https://speakerdeck.com/dafed/managing-css-projects-with-itcss?slide=62

Increasing specificity slowly one layer at a time
Affecting smaller parts of the DOM layer by layer
Progressively adding styles, never undoing

1. Tools – globally used mixins and functions. It’s important not to output any CSS in the first 2 layers.
2. Settings – Project variables: fonts, colors definitions, breakpoints, etc.
3. Generic – reset and/or normalize styles, box-sizing definition, etc. This is the first layer which generates actual CSS.
4. Elements – styling for bare HTML elements (like H1, A, etc.). These come with default styling from the browser so we can redefine them here.
5. Objects – class-based selectors which define undecorated design patterns, for example media object known from OOCSS
6. Components – specific UI components. This is where the majority of our work takes place and our UI components are often composed of Objects
7. Templates – Any page specific styles that are special and not connected to a component or object
8. Utilities – utilities and helper classes with ability to override anything which goes before in the triangle


## main.scss
```bash
assets/css/main.scss
```

The master CSS file that calls all the files for this project. Jekyll's asset 
pipeline uses this file to compile CSS and places the rendered CSS into `_site/assets/css`. 


## Autoprefixer

Keep in mind when writing CSS that normal unprefixed CSS3 is preferred. 
Autoprefixer is included in the Jekyll pipeline and will convert code according
to the latest caniuse.com usage tables. 

For more instructions should you desire to change the defaults, see 
[https://github.com/vwochnik/jekyll-autoprefixer](https://github.com/vwochnik/jekyll-autoprefixer)


## Browser Support

This project does not specifically support IE 11 — as in, no care is taken to polyfill
CSS that IE 11 does not support. Some care has been taken to make this a decent
experience, but IE 11 users will largely have a degraded experience. 

Heavy use of Flexbox, REM units, calc() functions, viewport units, and some CSS Grid.


### No jQuery

This project so far uses vanilla Javascript that *should* work back to IE 6.

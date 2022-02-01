Changelog
=========

Tracking design (theme) changes, not content changes

## 2022-01-29

Changed
+ Changed the body copy to use Alda light (300) so that links could remain Alda regular (400) and stand out a bit more.
+ Edited some URLs set in the head and footer to be universal, and not change from Stage to Production, so that we can possibly leverage incremental builds more efficiently.

## 2022-01-27

Added
+ HTML and styles on the Property Card for the homepage have been added to highlight NEW properties versus properties that have been posted previously but recently updated. Also tweaked the language to switch between “Added” and “Updated” with the date stamp. 

## 2022-01-15

Added
+ More detail to the JS AllProps array and functions to support finding nearby properties on an individual property page — JS calculates which properties are within a quarter mile and cycles through them to create a simple property card, then injects those results onto the property page as an enhancement

## 2022-01-09

Added
+ Pulled out #WhatAreTheyBuilding from the main loop and added them to their own loop at the bottom of the river.

## 2022-01-08

Changed
+ Moved away from Perma.cc links for a URL reference and to the Archive.org service instead. 
+ Added MLA/CMS citations for people to cut and paste if they so chose
+ Also changed the way the meta tags lay out when there are different combinations of them, particularly when there are more than 3 lists per property. 

## 2022-01-04

Changed
+ Edited and refined the visited styles a little more and added a native CSS contingency for when JS is not loaded.

## 2022-01-03

Added
+ Designers can now be directly related to eachother, with a "Related" field that will render as an array of other designers on the Taxonomy page. Technically, any tag could be related to any other but right now the code expects a designer items with the way that the URL is being written. 

## 2022-01-01

Added
+ A new data file to track artful images from various properties and display them on the home page halfway through the river of new posts. 

## 2021-12-31

Added
+ JS & CSS to support tracking visited link status in local storage so that we can add a data-attribute to visited links and style them with a bit more power than the CSS pseudo class allows us to do

## 2021-12-18

Changed
+ Removed the properties listing in Statistics by month added. This was tracking the changes in during 2020 and 2021 where old properties were being converted over to the new format. Almost all properties have been converted, so, we are moving back to just showing how many have been added per year. 

## 2021-12-12

Changed
+ Update the feed.xml file to also display an update message when present.

## 2021-12-09

Changed
+ Added a max-width to paragraphs (and li, dt, dd) of 92 characters. Added a max-width to taxonomy list ULs. In both cases, for wide screens, things were looking a bit too wide. 

## 2021-12-03

Changed
+ Added the ability for an update message for an individual property to get published on the home page

## 2021-11-06

Fixed
+ Added a missing closing div tag on the Instagram feed page

## 2021-10-20

Fixed
+ A small description fix on the Photos by Date page and to a property. The #ArchiveRI category is singular, not plural.

## 2021-09-15

Added
+ The All Properties page now supports typeahead real-time search by Address (Street name, City)

## 2021-09-10

Fixed
+ Superlatives were outputting in the wrong spot when designer was not present. Moved the output into a better location surrounded by `<li>` tags

## 2021-09-06

Added
+ RSS/Atom feeds for Properties and for Anecdotes
+ Icons to support Social and RSS Feeds
+ Additional Webmention support meta tags

Fixed
+ Open Graph meta tags for Facebook — page images did not use https

Moved
+ Social Media links out of the third column of the footer and into the Copyright area

## 2021-09-03

Added
+ A contact page

Fixed
+ A link from the Support page to a non-existent Contact page

Changed
+ Added a link to the existing What is ArtInRuins section of the footer to the attribution portion of the new Contact page

## 2021-09-02

Added
+ CSS support for tables
+ A seres of tables that explain the evolution of Stone, Carpenter, Willson, and Sheldon.

## 2021-08-23

Changed
+ Added a more resilient statement to the homepage
+ Remove a link to the old Urban Decay section in navigation in favor of the new category
* Added abbreviation class to instances of A.I.R. in the footer

## 2021-08-22

Fixed
+ Changed the way liquid statements nest and do a better job of hiding elements when there is no data — includes/property-card.html and layouts/property-item.html

## 2021-08-20

Changed
+ Remove a link to the old Redevelop section in navigation in favor of the new category

## 2021-08-12

Added
+ includes/property-card.html and layouts/property-item.html now allow the values of “Open” and “Closed” instead of “Built” and “Demolition” to support businesses like Javaspeed

## 2020-08-01

Added
+ The `mostrecentimage` variable to support the new list of properties in order by the newest image
+ Add a template to show properties in order by their oldest images in order to show which remaining properties need to have their images updated
+ H6 and a citation class to work with blockquotes

Changed
+ Removed environment checks. If the build used “incremental,” these checks would force every page to need to be rerendered for production. The intent here is to reduce the need to render every single page and use JS instead to change the dev environment the way we want to.

## 2021-06-18

Fixed
+ Refactor the way that properties, images, and anecdotes are counted in the stats and index files

## 2021-05-04

Added
+ To the both the property-item layout and the responsive image layout, add a tag for `decoding="async"` which is supposed to tell the browser that it is OK for image decoding to be done at a later moment so that the browser can continue displaying content even if the images are not fully loaded.

## 2021-04-18

Fixed
+ Moved property JS functions from the global file to the property specific file. They should have been there in the first place

## 2021-04-13

Changed
+ Added the first meta tag to support Webmentions 

## 2021-03-21

Changed
+ Switch to a better anchor pattern to support linking directly to photos from anywhere in the text. All photo wrappers have an ID now associated with them of `photo-[photo-name minus the three letter extension]` so that links are not numeric but based on the name of the image.

## 2021-03-18

Changed
+ Use `aria-current` instead of an “active” css class and add style support for the change

## 2021-03-08

Changed
+ Update the instagram template to allow the date variable to be optional. This allows us to add a new property post without it being posted on Instagram yet

## 2021-02-23

Changed
+ More math corrections to the stats and the index pages

## 2021-02-17

Added
+ Create an instagram feed page to support links to properties we have recently posted about

## 2021-02-12

Fixed
+ The production environment flag in the navigation file was rendering inconsistently

## 2021-02-10

Added
+ On-page search functions and style support for the All Properties page

Changed
+ Forced https in the htaccess file

## 2021-02-06

Added
+ Logic that makes numbers more human-readable: If 1 item in list, do nothing. If 2, add “and” in between. If three or more, put commas in between and “and” before the last one. Result is [item], [item], and [item] if there are three in the list

Changed
+ Trying to make the local builds more efficient in the index and navigation files

## 2021-01-01

Changed
+ Switch to an on page form for Anecdotes loaded via JS/Ajax. Add an external mailer file and try to provide many checks for possible spam postings with PHP

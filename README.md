Floom
=====

Floom is an extendible blinds-like slideshow widget for MooTools 1.3+.

![Screenshot](http://nouincolor.com/forge/banners/Floom.png)

How to use
----------

There are two ways of setting Floom up. One is the object way, where you specify the image url and the caption using the key-value notation:

### JavaScript

	var slides = [
	  {
	    image: 'photo-1.jpg',
	    caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit'
	  },
	  {
	    image: 'photo-2.jpg',
	    caption: 'Excepteur sint occaecat cupidatat non proident'
	  }
	];
 
	$('blinds').floom(slides, {
	  axis: 'vertical'
	});
	
### HTML

	<div id="blinds"></div>

The second one is by simply passing a element collection, ie. `$$('#blinds img')`, where the passed element has to be the actual image collection. In this scenario the caption is the elements **title** attribute:

### JavaScript

	$('blinds').floom($$('#blinds img'), {
	  axis: 'vertical'
	}); 

### HTML

	<div id="blinds">
	  <img title="Description 0" alt="" src="nature-photo0.jpg" />
	  <img title="Description 1" alt="" src="nature-photo1.jpg" />
	  <img title="Description 2" alt="" src="nature-photo2.jpg" />
	  <img title="Description 3" alt="" src="nature-photo3.jpg" />
	  <img title="Description 4" alt="" src="nature-photo4.jpg" />
	</div>

Options
-------

All options have default values assigned, hence are optional.

### Version 1.3

* Works with MooTools 1.3

### Version 1.1

* Bugfixes
* Removed **onFirst** and **onLast** options


### Version 1.0

* **prefix**: (str) class prefix for dynamically created elements. Defaults to floom
* **amount**: (int) amount of blinds. Defaults to 24
* **animation**: (int) animation duration for each blind (slice). Defaults to 70
* **interval**: (int) the interval between slide change. Defaults to 8000
* **axis**: (str) either horizontal or vertical. Defaults to vertical
* **progressbar**: (bool) show the progress bar. Defaults to true
* **captions**: (bool) show the captions. Defaults to true
* **captionsFxIn**: (obj) extend morph-in
* **captionsFxOut**: (obj) extend morph-out
* **slidesBase**: (str) the directory where to look for images/slides
* **sliceFxIn**: (obj) extend morph-in
* **onSlideChange**: fires on slide change
* **onPreload**: fires on slides preload (once, on script initialization)
* **onFirst**: fires when at the first slide
* **onLast**: fires when at the last slide
/*
---
script: floom.js
decription: Floom - MooTools-based blinds slideshow
license: MIT-style license.
authors:
 - Oskar Krawczyk (http://nouincolor.com/)
requires:
  core:1.3
  - Class.Extras
  - Element.Event
  - Element.Style
  - Element.Dimensions
  - Fx.Tween
  - Fx.Morph
  - String
  - Array
  - Assets
provides: [Floom]
...
*/


var Floom = new Class({
	
	Implements: [Events, Options],
		
	options: {
		prefix: 'floom_',
		amount: 24,
		animation: 70,
		interval: 8000,
		axis: 'vertical',
		progressbar: true,
		captions: true,
		captionsFxOut: {},
		captionsFxIn: {},
		slidesBase: '',
		sliceFxIn: {},
		onSlideChange: function(){},
		onPreload: function(){}
	},
	
	initialize: function(wrapper, slides, options){
		this.setOptions(options);
		
		wrapper = document.id(wrapper);
		
		this.slides = this.driver(slides);
		
		this.wrapper = {
			el: wrapper,
			width: [parseInt(wrapper.getStyles('width')['width']), wrapper.getSize().x].pick(),
			height: [parseInt(wrapper.getStyles('height')['height']), wrapper.getSize().y].pick()
		};

		this.slices = {
			els: [],
			width: (this.options.axis == 'vertical' ? this.wrapper.width / this.options.amount : this.wrapper.width).toInt(),
			height: (this.options.axis == 'vertical' ? this.wrapper.height : this.wrapper.height / this.options.amount).toInt()
		};

		this.current = {
			slide: -1,
			overlay: 0,
			counter: 0
		};

		this.preloadImgs = [];
		this.createStructure();	
	},
	
	driver: function(slides){
		// build the options object from a set of elements
		if (typeOf(slides[0]).contains('element')){
			this.slidesEl = [];

			// assign caption and the filename/url
			slides.each(function(slide){
				this.slidesEl.push({
					'image': slide.get('src'),
					'caption': slide.get('title')
				});
			}, this);

			// remove redundant elements
			slides.destroy().empty();

			// assign the new object
			slides = this.slidesEl;	
		}

		return slides;
	},
		
	horizontal: function(){
		return {
		'background-position': [0, -(this.slices.height * this.current.counter)]
		};	
	},

	vertical: function(){
		return {
			'background-position': [-(this.slices.width * this.current.counter), 0]
		};
	},

	createProgressbar: function(){
		this.progressbar = Element('div', {
			'class': this.options.prefix + 'progressbar',
			'morph': {
				'duration': this.options.interval - (this.options.animation * this.options.amount),
				'transition': 'linear'
			}
		});
		
		this.progressbar.inject(this.wrapper.el);
	},

	createCaptions: function(){
		this.captions = Element('div', {
			'class': this.options.prefix + 'caption',
			'html': 'caption',
			'styles': {
				'opacity': 0
			}
		});

		this.captions.inject(this.wrapper.el);
	},

	createStructure: function(){
		this.container = Element('div', {
			'class': this.options.prefix + 'container',
			'styles': {
				'height': this.wrapper.height,
				'width': this.wrapper.width
			}
		});

		this.container.inject(this.wrapper.el);

		// create the progress bar
		if (this.options.progressbar){
			this.createProgressbar();
		}

		// create the caption container
		if (this.options.captions){
			this.createCaptions();
		}

		// preload images and start up the slider
		this.preload();
	},

	createBlinds: function(idx){

		// update the global counter
		this.current.counter = idx;

		// create the slices
		this.slices.els[idx] = Element('div', {
			'class': this.options.prefix + 'slice ' + this.options.prefix + this.options.axis,
			'morph': {
				'duration': this.options.animation * 4
			},
			'styles': Object.merge({
				'opacity': 0,
				'width': this.slices.width,
				'height': this.slices.height,
				'background-image': 'url(' + this.options.slidesBase + this.slides[this.current.slide].image + ')'
			}, this[this.options.axis]())
		}).inject(this.container);

		// animate the slide
		new Fx.Morph(this.slices.els[idx]).start(Object.merge({
			'opacity': 1
		}, this.options.sliceFxIn));

		// move to the next slide
		if (idx == this.options.amount-1){
			this.step.delay(this.options.animation * 4, this);
		}
	},

	preload: function(){
		// build the images array
		this.slides.each(function(o){
			this.preloadImgs.push(this.options.slidesBase + o.image);
		}, this);

		// preload all and activate when done
		new Asset.images(this.preloadImgs, {
			onComplete: this.onPreload.bind(this)
		});
	},
	
	onPreload: function(){
		this.animateBlinds().periodical(this.options.interval, this);

		this.fireEvent('onPreload', this.slides[this.current.slide]);
	},

	animateBlinds: function(){
		this.current.slide++;

		// go back to the first one when at the end
		if (this.current.slide == this.slides.length){
			this.current.slide = 0;
		}

		// create blinds
		for (var idx = 0; idx < this.options.amount; idx++){
			this.createBlinds.delay(this.options.animation * idx, this, idx);
		}

		// hide the progressbar when it reaches the end
		if (this.options.progressbar){
			this.progressbar.fade('out');
		}

		if (this.options.captions){

			// apply the animation
			this.captions.morph(Object.merge({
				'opacity': 0
			}, this.options.captionsFxOut));
		}

		return this.animateBlinds;
	},

	step: function(){

		// apply the image to the background
		this.container.set('styles', {
			'background-image': 'url(' + this.options.slidesBase + this.slides[this.current.slide].image + ')'
		});

		// destory slices when animations finishes
		this.slices.els.each(function(slice){
			slice.destroy();
		});

		// prepeare and animate the progressbar
		if (this.options.progressbar){

			// calculate the width of the progressbar including margins
			var calculatedWidth = this.container.getSize().x - (this.progressbar.getStyles('margin-left')['margin-left'].toInt() * 2);

			// animate the size
			this.progressbar.morph({
				'width': [0, calculatedWidth]
			});

			// show the progressbar
			this.progressbar.fade('in');
		}
		
		// update and animate the caption
		if (this.options.captions){

			// update the copy
			this.captions.set('html', this.slides[this.current.slide].caption);

			// animate the caption
			this.captions.morph(Object.merge({
				'opacity': 1
			}, this.options.captionsFxIn));
		}
		
		this.fireEvent('onSlideChange', this.slides[this.current.slide]);
	}
});

Element.implement({
	floom: function(slides, options){
		return new Floom(this, slides, options);
	}
});

## Helium JS
Helium JS is a simple and lightweight solution to implement your code on scroll and resize events in a performant way without any dependencies. There isn't much you need to learn, the code is self initializing and collects data immediately. Helium JS is written in pure JS and is name spaced so it should be able to play nice with most other JS libraries.

## Features
- Detects Retina Devices
- Detects "Capable" Modern Browsers

- Actionable Data Collected
	- Scroll Values:
		- in pixels
		- in percentage points (of total scrollable)
		- scroll direction with inertia

	- Browser Size Values:
		- in pixels
		- resize direction with Inertia
		- center point (allows quadrant detection for mouse values, ie. top-left, bottom-right)

	- Webpage Size Values in pixels

- Custom Events
	- onScroll - write your own code for the scroll event
	- onResize - write your own code for the resize event


## Get Started
- Download the Repo.
- Add the Helium JS file to your project
- Load the Helium code before your JS file

Example:
```html
<body>
	<!-- your content here -->

	<!-- Helium JS -->
	<script src="helium.min.js"></script>

	<!-- Your Javascript File -->
	<script src="website.js"></script>
</body>
```

## Implementation
**In your JS file, you can include the following code:**
```javascript
//Custom Events Implementation
HE.onScroll = function(){console.log('You Scrolled'); };
HE.onResize = function(){console.log('You Resized'); };
```

**Two modernizr like tests have been included:**
```javascript
if(HE.capable){
	//Load special features that would break on old browsers
}

if(HE.retina){
	//Load retina images
} else {
	//Load standard images
}
```


**You can see all of the data that Helium JS collects for using in IF statements**
```javascript
console.log(HE.win); //browser window data
console.log(HE.doc); //document data
console.log(HE.mouse); //mouse movement data
console.log(HE.scroll); //user scrolling data
```

**Helium uses the console to communicate but only if you ask it to:**
```javascript
HE.dev = true; //only works with the .dev JS file
```
## Examples
**Hide element after Scrolling 200px Down for Desktop Devices**
```javascript
var el = document.querySelectorAll('.element');
//jQuery version: var el = $('.element');

HE.onScroll = function(){
	//if window is larger than 992px
	if (HE.win.x > 992) {

		//if window's Y Scroll value is larger than 199
		if (HE.scroll.y > 199) {
			el.style.display = 'none'; //jQuery version: el.hide();			
		} else {
			el.style.display = ''; //jQuery version: el.show();
		}
	}
};
```

**Load elements for Small Screens only**
Let's load special image content for small devices.

```javascript
var el = document.querySelectorAll('.element');
var runJustOnce = true;

//Custom onScroll Function
HE.onResize = function(){
	//if window is larger than 992px
	if (HE.win.x < 992) {

		//If Code hasn't already ran
		if (runJustOnce) {
			runJustOnce = false; //prevent second run

			//If screen is retina
			if (HE.retina) {
				el.setAttribute('style', 'background:url(image_x2.jpg)');
			} else {
				el.setAttribute('style', 'background:url(image.jpg)');
			}
		}
	}
};
```

### Performance Advice
HE.onResize and HE.onScroll should be treated like loops, everything you trigger should be as lean as possible to keep your frame rates high. To reduce lag use the HE.win and HE.scroll variables to trigger animations instead of using them to animate frame by frame, unless you're creating parallax effects.  (frame-by-frame example: 'style', 'margin-top: -' + HE.scroll.y + 'px'). Reduce lag further by using variables to determine if your code blocks need to fire on every iteration (ie. often once you've scrolled past a certain point the element you're targeting is out of view so don't alter that element needlessly.)

## Requirements
While not properly tested, Helium should support IE9 and above.
IE8+ can probably be supported via polyfill code for [requestAnimationFrame](https://gist.github.com/paulirish/1579671) and [addEventListener](https://gist.github.com/eirikbacker/2864711).

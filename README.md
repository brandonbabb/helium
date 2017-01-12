## Helium JS
Helium JS is a simple and lightweight solution to implement your code on scroll and resize events in a performant way. There isn't much you need to learn, just initialize and go. Helium JS currently requires jQuery, but it should be able to play nice with most other JS libraries.

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
- Load jQuery before Helium
- Load Helium before your JS code

## Implementation
Helium JS is easy to use see the code below for quick implementation

**Initialize Helium JS**
```javascript
HE.init();
```

**Custom Event Based Code**
```javascript
//Custom Events Implementation
HE.onScroll = function(){console.log('You Scrolled'); };
HE.onResize = function(){console.log('You Resized'); };
```

**Detect Retina Displays or Capable Browsers**
```javascript
if(HE.capable){/*Load special features that would break on old browsers*/}
if(HE.retina){/*Load retina images*/} else {/*Load standard images*/}
```

**Access Helium's Collected Data in Console**
```javascript
console.log(HE.win); //browser window data
console.log(HE.doc); //document data
console.log(HE.mouse); //mouse movement data
console.log(HE.scroll); //user scrolling data
```

**Access Realtime Data Collection in Console**
```javascript
HE.dev = true;
```


## Examples
**Hide element after Scrolling 200px Down for Desktop Devices**
```javascript
HE.onScroll = function(){
	//if window is larger than 992px
	if (HE.win.x > 992) {

		//if window's Y Scroll value is larger than 199
		if (HE.scroll.y > 199) {
			$('.element').hide();
		} else {
			$('.element').show();
		}
	}
};
```

**Load elements for Small Screens only**
Let's load special image content for small devices.

```javascript
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
				$('.element').setAttribute('style', 'background:url(image_x2.jpg)');
			} else {
				$('.element').setAttribute('style', 'background:url(image.jpg)');
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

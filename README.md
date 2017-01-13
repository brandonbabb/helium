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

	- Browser Size (window) Values:
		- in pixels
		- resize direction with inertia
		- center point (allows quadrant detection for mouse values, ie. top-left, bottom-right)

	- Webpage Size (document) Values in pixels

- Custom Events
	- onScroll - write your own code for the scroll event
	- onResize - write your own code for the resize event
	- onMouseMove - write your own code for the mouse move event


## Get Started
- Download the Repo.
- Add the Helium JS file to your project
- Load jQuery before Helium
- Load Helium before your JS code

When developing your website it's helpful to use the more feature rich .dev version of the library.
When it's time to launch your website you can use the lighter production version of the library.

## Implementation
Helium JS is easy to use see the code below for quick implementation

**Initialize Helium JS**
Getting started is simple, just invoke the init function like this:
```javascript
HE.init();
```

The init function has some minor features that might help with your project:
```javascript
// HE.init(allowMouseTracking, allowConsole, allowHTMLMessages); */
// allowMouseTracking when equal to true enables mouse movement tracking (all versions)
// allowConsole when equal to true logs console messages from Helium (*.dev file only)
// allowHTMLMessages when equal to true logs HTML messages from Helium (*.dev file only)
HE.init(true, true, true);

// You can selectively enable and disable features
HE.init(false, false, true);
// Here we've kept mouse tracking and console logs disabled, but enabled HTML messages
```

**Custom Event Based Code**
```javascript
//Custom Events Implementation
HE.onScroll = function(){console.log('You Scrolled'); };
HE.onResize = function(){console.log('You Resized'); };
HE.onMouseMove = function(){console.log('You Moved the Mouse'); };
```

**Detect Retina Displays or Capable Browsers**
```javascript
// Load special features that would break on old browsers
if (HE.capable) {
	// Your code here, maybe a HTML5 Video or localStorage content
}

// Detect if user's device is High DPI
if (HE.retina) {
	// Load retina images
} else {
	// Load standard images
}
```

**Access Helium's Collected Data in the Browser's Console**
Because the Helium variable is a public variable you can refer to it in your code, you can poke and prod and use any of the data collected.
```javascript
console.log(HE); // See everything
console.log(HE.win); // Browser window data
console.log(HE.doc); // Document data
console.log(HE.mouse); // Mouse movement data
console.log(HE.scroll); // User scrolling data
```


## Code Examples
**Load Different Images for Small Retina and Non-Retina Screens**
Let's load content for only smaller devices. Some users have a high DPI device so let's load higher quality images for them.
```javascript
HE.init(); //Start Helium

// Is window narrower than 992px?
if (HE.win.width < 992) {

	// Is screen high DPI?
	if (HE.retina) {
		$('.element').setAttribute('style', 'background-image:url(image_x2.jpg)');
	} else {
		$('.element').setAttribute('style', 'background-image:url(image.jpg)');
	}
}
```

**Show an Element After Scrolling 200px Down the Page**
You can trigger hiding or showing an element anytime the user scrolls, the example below hides an element only for desktop devices where a user has scrolled 200px or more down the page:
```javascript
//Your code here

HE.init(); //Start Helium
var toggle = false; // HE.onScroll() runs like a loop so lets prevent code from running endlessly

//Lets attach custom code to run each time the user scrolls
HE.onScroll = function(){
	// Is window wider than 992px?
	if (HE.win.width > 992) {

		// Has user scrolled further than 199 pixels?
		if (HE.scroll.y.px > 199) {

			//Is it already showing?
			if (!toggle) {
					$('.element').show(); //Show the element
					toggle = true; //We're using the toggle variable to prevent jQuery from trying to hide the element each time the user scrolls
			}

		} else {

			//Is it already hidden?
			if (toggle) {
				$('.element').hide(); //Hide the element
				toggle = false; //We're using the toggle variable to prevent jQuery from trying to show the element each time the user scrolls
			}

		}
	}
};
```
The .onScroll function can run hundreds of times per second so it's a good idea to prevent intensive actions from repeating needlessly. If your site feels "janky" when you scroll the browser window, you should check your code referenced in the .onScroll function for any possible improvements. You can see that with Helium, it's easy to specify multiple layers of logic to get your targeted experience, you can quickly specify a different experience for mobile, tablet, and desktop devices based on [height and width of devices](http://www.websitedimensions.com).


**Simple Parallax**
Helium can help with simple parallax effects without a full blown library.
```javascript
HE.init(); //Start Helium

//Code to trigger on every scroll event
HE.onScroll = function(){
	// slight blur on movement
	$('#element1').css("transform":"translate(" + HE.scroll.x.px +"px, " + HE.scroll.x.px + "px)");
	$('#element2').css("transform":"translate(" + -HE.scroll.x.px +"px, " + -HE.scroll.x.px + "px)");

	// worse performance
	//$('#element1').css("margin":" + HE.scroll.x.px +"px " + HE.scroll.x.px + "px 0 0");
	//$('#element2').css("margin":" + -HE.scroll.x.px +"px " + -HE.scroll.x.px "px 0 0");
};
```
The .onScroll function can run hundreds of times per second so it's a good idea to be very intentional with your parallax effects. Animating using the Translate property will generally perform better than using margin or padding to move elements but will slightly blur the element. You can also use similar code to move background images using the background-position property. Currently Helium only watches scrolling from the body element, but you could alter the element watched in the source code (on line 256: window.addEventListener("scroll", scrollRequest, true);)


### Performance Advice
HE.onResize and HE.onScroll should be treated like loops, everything you trigger should be as lean as possible to keep your frame rates high.

*To reduce lag:*
- Use the HE.onResize and HE.onScroll variables to *trigger animations instead of animating frame by frame*, unless you're creating parallax effects.
- Using variables to determine if your code blocks really need to fire on every iteration.
- Consider moving code outside of HE.onResize() and HE.onScroll() functions if possible especially if the code only runs once.

## Requirements
[jQuery](http://jquery.com/download/)
requestAnimationFrame support is required [requestAnimationFrame polyfill](https://gist.github.com/paulirish/1579671)
IE8 can be supported with a [addEventListener polyfill](https://gist.github.com/eirikbacker/2864711)

Helium hasn't been tested in every possible environment, [if your encounter a bug, please mark it down!](https://github.com/brandonbabb/Helium-JS/issues)

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
He.capable; //allows you to load special modern browser resources
HE.retina; //allows you to load special retina only resources
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

## Requirements
While not properly tested, Helium should support IE9 and above.
IE8+ can probably be supported via pollyfill code for requestAnimationFrame and addEventListener.

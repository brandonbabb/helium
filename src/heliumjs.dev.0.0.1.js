/*!
 * Helium-JS v0.1.0 (https://github.com/brandonbabb/Helium-JS)
 * Copyright 2011-2017 The Helium Authors (https://github.com/brandonbabb/Helium-JS/graphs/contributors)
 * Licensed under MIT (https://github.com/brandonbabb/Helium-JS/blob/master/LICENSE)
 */
var HE;
(function() {

	var $html = document.documentElement,
		$body = document.getElementsByTagName("body")[0],
		cachedWidth = -1,
		cachedHeight = -1,
		cachedScrollX = -1,
		cachedScrollY = -1,
		cachedMouseX = -1,
		cachedMouseY = -1,
		scrollableX = 0,
		scrollableY = 0,
		firstRun = true,
		lockWindowUpdate = false,
		lockScrollUpdate = false;

	function capableTest(){
		if("querySelector" in document && "localStorage" in window && "addEventListener" in window) {return true; }
		return false;
	}

	function retinaTest(){
		var query = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
		if (window.devicePixelRatio > 1) {return true; }
		if (window.matchMedia && window.matchMedia(query).matches) {return true; }
		return false;
	}

	HE = {
		dev: 0,

		/* User's Display size, ratio, changes, and more */
			/* win (window) (object) {
					width (width of window in px),
					height (height of window in px),
					dirX (Direction/Inertia),
					dirY (Direction/Inertia),
					centerX (Middle Point of Screen X),
					centerY (Middle Point of Screen Y),
				},
			*/
			win: {
				width: 0,
				height: 0,
				dirX: 0,
				dirY: 0,
				centerX: 0,
				centerY: 0
			},

			/*
			doc (document) (object) {
				width (width of document in px),
				height (height of document in px)
			}
			*/
			doc: {
				width: 0,
				height: 0
			},

			/* Scroll	(object) {
					x (object) {
						px (Current Value in px),
						percent (Percent of Total),
						dir (Direction & Inertia)
					},

					y (object) {
						px (Current Value in px),
						percent (Percent of Total),
						dir (Direction & Inertia)
					}
				}
			*/
			scroll: {
				x: {
					px : 0,
					percent : 0,
					dir : 0
				},
				y: {
					px : 0,
					percent : 0,
					dir : 0
				}
			},

			/* mouse (object) {
				x (object) {
					px (Current Value in px),
					quad (quadrant; 0 = left half of screen, 1 - right half of screen),
					dir (Direction and Inertia, positive = right, negative = left)
				},
				y (object) {
					px (Current Value in px),
					quad (quadrant; 0 = top half of screen, 1 - bototm half of screen),
					dir (direction and inertia, positive = up, negative = down)
				}
			}
			*/
			mouse: {
				x : {
					px: 0,
					quad: 0,
					dir: 0
				},
				y: {
					px: 0,
					quad: 0,
					dir: 0
				}
			},

			retina: retinaTest(),
			capable: capableTest(),

			//Functions to be written by user
			onScroll: function(){},
			onResize: function(){}
	};

	function updateWindow(){
		//Window/Document Width and Height
		HE.win.width = window.innerWidth || $html.clientWidth || $body.clientWidth;
		HE.win.height = window.innerHeight || $html.clientHeight || $body.clientHeight;
		HE.doc.width = Math.max(document.body.scrollWidth, document.body.offsetWidth, $html.clientWidth, $html.scrollWidth, $html.offsetWidth);
		HE.doc.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, $html.clientHeight, $html.scrollHeight, $html.offsetHeight);

		//Help for development
		if(HE.dev === true){
			console.log("HE.win (browser size) [width:" + HE.win.width + "(px), height: " + HE.win.height + "(px), centerX:" + HE.win.centerX + "(px), centerY" + HE.win.centerY + "(px)]");
			console.log("HE.doc (page size) [width:" + HE.doc.width + "(px), height:" + HE.doc.height + "(px)]");
			if(!firstRun){console.log("HE.win [dirX:" + HE.win.dirX + ", dirY:" + HE.win.dirY + "]"); }
		}

		//Save resources unless changes
		if(HE.win.width !== cachedWidth){
			if(!firstRun){HE.win.dirX = HE.win.width - cachedWidth; } //Difference X
			cachedWidth = HE.win.width; //Set Cache
			HE.win.centerX = HE.win.width / 2; //centerX
			scrollableX = HE.doc.width - HE.win.width; //Document Scrollable?
		}

		if(HE.win.height !== cachedHeight){
			if(!firstRun){HE.win.dirY = HE.win.height - cachedHeight; } //Difference Y
			cachedHeight = HE.win.height; //Set Cache
			HE.win.centerY = HE.win.height / 2; //centerY
			scrollableY = HE.doc.height - HE.win.height; //Document Scrollable?
		}

		//Run User's Code
		HE.onResize();

		//Initial values are set
		firstRun = false;

		//Unlock function to be able to run again
		lockWindowUpdate = false;
	}
	updateWindow();

	function updateScroll(){
		//Perform calculations about current position in website
		HE.scroll.x.px = window.pageXOffset;
		HE.scroll.y.px = window.pageYOffset;

		//Help for development
		if(HE.dev === true){
			console.log('Scroll (x:' + HE.scroll.x.px + ' (' + (HE.scroll.x.percent).toPrecision(1)  + ', ' + HE.scroll.x.dir.toPrecision(1) + '), y:' + HE.scroll.y.px + ' (' + (HE.scroll.y.percent).toPrecision(1)  + ', ' + HE.scroll.y.dir.toPrecision(1) + ')' + 'Cache: '+cachedScrollX +","+cachedScrollY);
		}

		//Save resources if possible
		if(cachedScrollY !== HE.scroll.y.px) {
			if(!firstRun){HE.scroll.y.dir = HE.scroll.y.px - cachedScrollY; } //Direction
			cachedScrollY = HE.scroll.y.px; //Reset Cache

			//Calculate Percentage unless divide by zero
			if(scrollableY != 0) {
				HE.scroll.y.percent = HE.scroll.y.px / scrollableY;
			} else {
				HE.scroll.y.percent = 1;
			}
		}

		//Save resources if possible
		if(cachedScrollX !== HE.scroll.x.px){
			if(!firstRun){HE.scroll.y.dir = HE.scroll.y.px - cachedScrollY; } //Direction
			cachedScrollX = HE.scroll.x.px; //Reset Cache

			//Calculate Percentage unless divide by zero
			if(scrollableX != 0){
				HE.scroll.x.percent = HE.scroll.x.px / scrollableX;
			} else {
				HE.scroll.x.percent = 1;
			}
		}

		//Implement user's custom code
		HE.onScroll();

		//Initial values are set
		firstRun = false;

		//Unlock function to run again
		lockScrollUpdate = false;
	}
	updateScroll();

	/* Request function calls if not busy running same function */
	function scrollRequest() {
		if(!lockScrollUpdate) {
			lockScrollUpdate = true;
			requestAnimationFrame(updateScroll);
		}
	}
	function resizeRequest() {
		if(!lockWindowUpdate){
			lockWindowUpdate = true;
			requestAnimationFrame(updateWindow);
		}
	}

	window.addEventListener('resize', resizeRequest, true);
	window.addEventListener('scroll', scrollRequest, true);
	window.addEventListener('resize', scrollRequest, true);
}());

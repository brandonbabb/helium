/*!
 * Helium-JS v0.1.0 (https://github.com/brandonbabb/Helium-JS)
 * Copyright 2011-2017 The Helium Authors (https://github.com/brandonbabb/Helium-JS/graphs/contributors)
 * Licensed under MIT (https://github.com/brandonbabb/Helium-JS/blob/master/LICENSE)
 */
//Global variable so your your code can interact with it
var HE;
(function($) {

	//The following variables are private and exist to save resources
	var $window = $(window),
			$document = $(document),
			$body = $("body"),
			cachedWidth = -1,
			cachedHeight = -1,
			cachedScrollX = -1,
			cachedScrollY = -1,
			cachedMouseX = -1,
			cachedMouseY = -1,
			scrollableX = 0,
			scrollableY = 0,
			lockWindowUpdate = false,
			lockScrollUpdate = false,
			lockMouseUpdate = false,
			firstRun = false;

	/** capableTest (function) Private
		* returns: truthful boolean value if the browser passes a "cut the mustard" test, many thanks to BBC website.
	*/
	function capableTest() {
		if("querySelector" in document && "localStorage" in window && "addEventListener" in window) {return true; }
		return false;
	}

	/** retinaTest (function) Private
	 * returns: truthful boolean value if browser passes a mediaQuery test
	 */
	function retinaTest() {
		var query = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
		if (window.devicePixelRatio > 1) {return true; }
		if (window.matchMedia && window.matchMedia(query).matches) {return true; }
		return false;
	}

	/* Request function calls if not busy running same function */
	function scrollRequest() {if(!lockScrollUpdate) {lockScrollUpdate = true; requestAnimationFrame(updateScroll); }}
	function resizeRequest() {if(!lockWindowUpdate){lockWindowUpdate = true; requestAnimationFrame(updateWindow); }}
	function mouseRequest() {if(!lockMouseUpdate){lockMouseUpdate = true;	requestAnimationFrame(updateMouse); }}

	/** var HE (Object) Public
	 *  Desc: Helium JS global variable
	 */
	HE = {
		dev: false, //use HE.dev = true; to see console messages

			/* window (object) Public {
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
			document (object) Public {
				width (width of document in px),
				height (height of document in px)
			}
			*/
			doc: {
				width: 0,
				height: 0
			},

			/* Scroll	(object) Public {
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

			/* mouse (object) Public {
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

			//Basic functions to be rewritten by user
			onScroll: function(){},
			onResize: function(){},
			onMouseMove: function(){},

			//Initiallize Helium JS in your project
			init: function() {
				window.addEventListener("resize", resizeRequest, true);
				window.addEventListener("scroll", scrollRequest, true);
				window.addEventListener("resize", scrollRequest, true);
				$body.mousemove(function(e){
					HE.mouse.x.px = e.pageX;
					HE.mouse.y.px = e.pageY;
					mouseRequest();
				});

				//Run functions immediately
				updateScroll();
				updateWindow();

				//It"s currently impossible to know a mouse"s coordinates until it"s moved,
				//it"s more likely to be somewhere in the middle of the window
				//vs the very top left pixel of the screen.
				//http://stackoverflow.com/questions/2601097/how-to-get-the-mouse-position-without-events-without-moving-the-mouse
				HE.mouse.x.px = HE.view.centerX;
				HE.mouse.y.px = HE.view.centerY;
			}
	};


	/** updateWindow (function) Private
	 *	This function calculates window and document properties, it is called when the window is resized by the user
	 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
	 */
	function updateWindow() {
		//Window/Document Width and Height
		HE.win.width = $window.width();
		HE.win.height = $window.height();
		HE.doc.width = $document.width();
		HE.doc.height = $document.outerHeight();

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

		HE.onResize(); //Run User"s Code
		firstRun = false; //Initial values are set
		lockWindowUpdate = false; //Unlock function to be able to run again
	}

	/** updateScroll (function) Private
	 *	This function calculates scroll positions, it is called when the window is scrolled by the user
	 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
	 */
	function updateScroll() {
		//Perform calculations about current position in website
		HE.scroll.x.px = window.pageXOffset;
		HE.scroll.y.px = window.pageYOffset;

		//Help for development
		if (HE.dev === true) {
			console.log("Scroll (x:" + HE.scroll.x.px + " (" + (HE.scroll.x.percent).toPrecision(1)  + ", " + HE.scroll.x.dir.toPrecision(1) + "), y:" + HE.scroll.y.px + " (" + (HE.scroll.y.percent).toPrecision(1)  + ", " + HE.scroll.y.dir.toPrecision(1) + ")" + "Cache: "+cachedScrollX +","+cachedScrollY);
		}

		//Save resources if possible
		if (cachedScrollY !== HE.scroll.y.px) {
			if(!firstRun){HE.scroll.y.dir = HE.scroll.y.px - cachedScrollY; } //Direction
			cachedScrollY = HE.scroll.y.px; //Reset Cache

			//Calculate Percentage unless divide by zero
			if(scrollableY !== 0) {
				HE.scroll.y.percent = HE.scroll.y.px / scrollableY;
			} else {
				HE.scroll.y.percent = 1;
			}
		}

		//Save resources if possible
		if (cachedScrollX !== HE.scroll.x.px) {
			if(!firstRun){HE.scroll.y.dir = HE.scroll.y.px - cachedScrollY; } //Direction
			cachedScrollX = HE.scroll.x.px; //Reset Cache

			//Calculate Percentage unless divide by zero
			if(scrollableX !== 0){
				HE.scroll.x.percent = HE.scroll.x.px / scrollableX;
			} else {
				HE.scroll.x.percent = 1;
			}
		}

		/** updateMouse (function) Private
		 *	This function calculates mouse coordinates, it is called when the mouse is moved by the user
		 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
		 */
		function updateMouse() {
			//Perform calculations about current position in website
			HE.mouse.x.px = window.pageXOffset;
			HE.mouse.y.px = window.pageYOffset;

			//Save resources if possible
			if (cachedMouseY !== HE.mouse.y.px) {
				if (!firstRun) {HE.mouse.y.dir = HE.mouse.y.px - cachedMouseY; } //Direction
				cachedMouseY = HE.mouse.y.px; //Reset Cache
			}

			//Save resources if possible
			if (cachedMouseX !== HE.mouse.x.px) {
				if (!firstRun) {HE.mouse.x.dir = HE.mouse.x.px - cachedMouseX; } //Direction
				cachedMouseX = HE.mouse.x.px; //Reset Cache
			}

			HE.onMouseMove(); //Run User"s Code
			firstRun = false; //Initial values are set
			lockScrollUpdate = false; //Unlock function to be able to run again
		}
	}
}(jQuery));

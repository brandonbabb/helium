/*!
 * Helium-JS v0.1.2 (https://github.com/brandonbabb/Helium-JS)
 * Copyright 2017 The Helium Authors (https://github.com/brandonbabb/Helium-JS/graphs/contributors)
 * Licensed under MIT (https://github.com/brandonbabb/Helium-JS/blob/master/LICENSE)
 */
//Global variable so your your code can interact with it
var HE;
(function($) {
	"use strict";

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

	/** var HE (Object) Public
	 *  Desc: Helium JS global variable
	 */
	HE = {
			/* window (object) Public {
					width (width of window in px),
					height (height of window in px),
					dirX (Direction/Inertia),
					dirY (Direction/Inertia)
				},
			*/
			win: {
				width: 0,
				height: 0,
				dirX: 0,
				dirY: 0
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
				x (Current Value in px of window),
				y (Current Value in px of window),
				dirX (Direction and Inertia, positive = right, negative = left),
				dirY (direction and inertia, positive = up, negative = down),
				docX (Current Value in px of window),
				docY (Current Value in px of document),
				target (selector for object mouse is pointed at)
			}
			*/
			mouse: {
				x : 0,
				y : 0,
				dirX: -1,
				dirY: -1,
				docX: 0,
				docY: 0,
				target: {} //jQuery Selection Object ie. $("target")
			},

			retina: retinaTest(),
			capable: capableTest(),

			//Basic functions to be rewritten by user
			onScroll: function(){},
			onResize: function(){},
			onMouseMove: function(){}
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

		//Save resources unless changes
		if(HE.win.width !== cachedWidth){
			if(!firstRun){
				HE.win.dirX = HE.win.width - cachedWidth;
			}
				 //Difference X
			cachedWidth = HE.win.width; //Set Cache
			scrollableX = HE.doc.width - HE.win.width; //Document Scrollable?
		} else {
			HE.win.dirX = 0;
		}

		if(HE.win.height !== cachedHeight){
			if(!firstRun){HE.win.dirY = HE.win.height - cachedHeight; } //Difference Y
			cachedHeight = HE.win.height; //Set Cache
			scrollableY = HE.doc.height - HE.win.height; //Document Scrollable?
		} else {
			HE.win.dirY = 0;
		}

		HE.onResize(); //Run User"s Code
		lockWindowUpdate = false; //Unlock function to be able to run again
	}

	/** updateMouse (function) Private
	 *	This function calculates mouse coordinates, it is called when the mouse is moved by the user
	 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
	 */
	function updateMouse() {
		//Save resources if possible
		if (cachedMouseY !== HE.mouse.y) {
			if (!firstRun) {HE.mouse.dirY = (HE.mouse.y - cachedMouseY)/100; } //Direction
			HE.mouse.winY = HE.mouse.y - HE.scroll.x.px; //Return coordinates of window, not document
			cachedMouseY = HE.mouse.y; //Reset Cache
		}

		//Save resources if possible
		if (cachedMouseX !== HE.mouse.x) {
			if (!firstRun) {HE.mouse.dirX = (HE.mouse.x - cachedMouseX)/100; } //Direction
			HE.mouse.winY = HE.mouse.y - HE.scroll.y.px; //Return coordinates of window, not document
			cachedMouseX = HE.mouse.x; //Reset Cache
		}

		HE.onMouseMove(); //Run User"s Code
		lockMouseUpdate = false; //Unlock function to be able to run again
	}

	/** updateScroll (function) Private
	 *	This function calculates scroll positions, it is called when the window is scrolled by the user
	 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
	 */
	function updateScroll() {
		//Perform calculations about current position in website
		HE.scroll.x.px = window.pageXOffset;
		HE.scroll.y.px = window.pageYOffset;

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

		HE.onScroll(); //Run User"s Code
		lockScrollUpdate = false; //Unlock function to be able to run again
	}

	/* Request function calls if not busy running same function */
	function scrollRequest() {if(!lockScrollUpdate) {lockScrollUpdate = true; requestAnimationFrame(updateScroll); }}
	function resizeRequest() {if(!lockWindowUpdate){lockWindowUpdate = true; requestAnimationFrame(updateWindow); }}
	function mouseRequest(e) {
		if(!lockMouseUpdate){
			lockMouseUpdate = true;
			HE.mouse.docX = e.pageX;
			HE.mouse.docY = e.pageY;
			HE.mouse.x = e.screenX;
			HE.mouse.y = e.screenY;

			//Get best possible target selector as string
			if (e.target.id) {
				HE.mouse.target = "#" + e.target.id;
			} else if (e.target.className){
				HE.mouse.target = "." + e.target.className;
			} else {
				HE.mouse.target = "body";
			}

			requestAnimationFrame(updateMouse);
		}
	}

	HE.init = function(disableMouseTracking){
		window.addEventListener("resize", resizeRequest, true);
		window.addEventListener("resize", scrollRequest, true);
		window.addEventListener("scroll", scrollRequest, true);
		updateScroll();
		updateWindow();

		//if disableMouseTracking = true, disable mouse tracking
		if(!disableMouseTracking){
			$body.mousemove(function(e){mouseRequest(e);});

			//It"s currently impossible to know a mouse"s coordinates until it"s moved,
			//it"s more likely to be somewhere in the middle of the window
			//vs the very top left pixel of the screen.
			//http://stackoverflow.com/questions/2601097/how-to-get-the-mouse-position-without-events-without-moving-the-mouse
			mouseRequest({pageX: HE.win.width / 2,pageY: HE.win.height / 2,screenX: HE.win.width / 2,screenY: HE.win.height / 2,target: "body"});
		}
		firstRun = false; //Initial values are set
	};
}(jQuery));

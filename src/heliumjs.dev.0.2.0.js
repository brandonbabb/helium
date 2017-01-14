/*!
 * Helium-JS v0.2.0 (https://github.com/brandonbabb/Helium-JS)
 * Copyright 2017 The Helium Authors (https://github.com/brandonbabb/Helium-JS/graphs/contributors)
 * Licensed under MIT (https://github.com/brandonbabb/Helium-JS/blob/master/LICENSE)
 */
// Global variable so your your code can interact with it
var HE;
(function($) {
	"use strict";

	// The following variables are private and exist to save resources
	var $window = $(window),
			$document = $(document),
			$body = $("body"),
			previousWidth = -1,
			previousHeight = -1,
			previousScrollX = -1,
			previousScrollY = -1,
			previousMouseX = -1,
			previousMouseY = -1,
			scrollableX = 0,
			scrollableY = 0,
			lockWindowUpdate = false,
			lockScrollUpdate = false,
			lockMouseUpdate = false,
			firstRun = false,
			developmentLog = false,
			developmentElement = false;

	/** capableTest (function) Private
		* returns: truthful boolean value if the browser passes a "cut the mustard" test
		* many thanks to BBC website and CSStricks (https://css-tricks.com/server-side-mustard-cut/)
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
			/* Size (Object) Public {
					win "Window" (object) {
						x (width of website measured as the browser's dimensions in px),
						y (height of website measured as the browser's dimensions in px),
					},

					doc "Document" (object) {
						x (width of website measured as the document's dimensions in px),
						y (height of website measured as the document's dimensions in px)
					},

					ff "Force Feedback" (object) {
						x (Current resize horizontal direction --if any-- measured with inertia, left = negative, right = positive)
						y (Current resize vertical direction --if any-- measured with inertia, up = negative, down = positive),
					}
				}
			*/
			size: {
				win: {
					x: 0,
					y: 0,
				},
				doc : {
					x: 0,
					y: 0
				},
				ff : {
					x: 0,
					y: 0
				}
			},

			/* Scroll	(object) Public {
					px "Pixels" (object) {
						x (Current horizontal scroll value in px),
						y (Current vertical scroll value in px),
					},
					pct "Percent" (object) {
						x (Current horizontal scroll value percent, ranges from 0-1)
						y (Current vertical scroll value percent, ranges from 0-1)
					}
					ff "Force Feedback" (object) {
						x (Current scroll horizontal direction --if any-- measured with inertia, left = negative, right = positive)
						y (Current scroll direction --if any-- measured with inertia, up = negative, down = positive),
					}
				}
			*/
			scroll: {
				px : {
					x: 0,
					y: 0
				},
				pct : {
					x: 0,
					y: 0
				},
				ff : {
					x: 0,
					y: 0
				}
			},

			/* mouse (object) Public {
				win "Window" (object) {
					x (current mouse horizontal coordinate compared against browser frame, in pixels),
					y (current mouse vertical coordinate compared against browser frame, in pixels)
				},
		 		doc "Document" (object) {
					x (current mouse horizontal coordinate compared against page size, in pixels),
					y (current mouse vertical coordinate compared against page size, in pixels)
				},
				ff "Force Feedback" (object) {
					x (),
					y ()
				}
				target (string) (CSS selector for object mouse is pointed at, only ID or Class, if no class or id it returns 'body')
			}
			*/
			mouse: {
				win : {
					x: 0,
					y: 0
				},
				doc : {
					x: 0,
					y: 0
				},
				ff : {
					x: 0,
					y: 0
				},
				target: "" // jQuery Selection Object ie. $("target")
			},

			/* detect (Object) Public {
				retina (method) detects if the user's browser is high DPI, (not a plug for apple, retina is easier to type and remember than hidpi or hiDPI),
				capable (method) detects querySelector,	localStorage,	addEventListener features to determine if browser "cuts the mustard"
			}
			*/
			detect: {
				retina: retinaTest(),
				capable: capableTest()
			},

			// Basic functions to be rewritten by user
			onScroll: function(){},
			onResize: function(){},
			onMouseMove: function(){}
	};


	/** updateWindow (function) Private
	 *	This function calculates window and document properties, it is called when the window is resized by the user
	 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
	 */
	function updateWindow() {
		// Window/Document Width and Height
		HE.size.win.x = $window.width();
		HE.size.win.y = $window.height();
		HE.size.doc.x = $document.width();
		HE.size.doc.y = $document.outerHeight();

		// Console messages for developers
		if(developmentLog){
			console.log("HE.size.win {x:" + HE.size.win.x + ", y: " + HE.size.win.y + "}");
			console.log("HE.size.doc {x:" + HE.size.doc.x + ", y:" + HE.size.doc.y + "}");
			if(!firstRun){
				console.log("HE.size.ff [x:" + HE.size.ff.x + ", y:" + HE.size.ff.y + "]");
			}
		}
		// HTML messages for developers
		if(developmentElement){
			$("#HE .r").text("HE.size.win {x:" + HE.size.win.x + ", y: " + HE.size.win.y + "} HE.size.ff {x:" + HE.size.ff.x + ", y:" + HE.size.ff.y + "} HE.size.doc {x:" + HE.size.doc.x + ", y:" + HE.size.doc.y + "}");
		}

		// Detect vertical movement
		if(HE.size.win.y !== previousHeight){
			// Vertical force feedback
			if(!firstRun){HE.size.ff.y = HE.size.win.y - previousHeight; }
			previousHeight = HE.size.win.y; // Set Cache
			scrollableY = HE.size.doc.y - HE.size.win.y; // Document Scrollable?
		} else {
			HE.size.ff.y = 0; // No movement so no force feedback
		}

		// Detect horizontal movement
		if(HE.size.win.x !== previousWidth){
			// horizontal force feedback
			if(!firstRun){
				HE.size.ff.x = HE.size.win.x - previousWidth;
			}

			previousWidth = HE.size.win.x; // Set Cache
			scrollableX = HE.size.doc.x - HE.size.win.x; // Document Scrollable?
		} else {
			HE.size.ff.x = 0;
		}

		HE.onResize(); // Run User"s Code
		lockWindowUpdate = false; // Unlock function to be able to run again
	}

	/** updateMouse (function) Private
	 *	This function calculates mouse coordinates, it is called when the mouse is moved by the user
	 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
	 */
	function updateMouse() {
		// Console messages for developers
		if (developmentLog) {
			console.log("HE.mouse.win: {x:"+HE.mouse.win.x+", y:"+HE.mouse.win.y+"}");
			console.log("HE.mouse.ff: {x:"+HE.mouse.ff.x, ", y:" + HE.mouse.ff.y+"}");
			console.log("HE.mouse.doc: {x:"+HE.mouse.doc.x+", y:"+HE.mouse.doc.y+"}");
		}

		// HTML messages for developers
		if(developmentElement){
			$("#HE .m").text("HE.mouse.win: {x:"+HE.mouse.win.x+", y:"+HE.mouse.win.y+"} HE.mouse.ff: {x:"+HE.mouse.ff.x+", y:"+HE.mouse.ff.y+ "} HE.mouse.doc: {x:"+HE.mouse.doc.x+", y:"+HE.mouse.doc.y+"} HE.mouse.target:"+HE.mouse.target+"}");
		}

		// Detect vertical movement
		if (previousMouseY !== HE.mouse.win.y) {
			// Get force feedback
			if (!firstRun) {HE.mouse.ff.y = (HE.mouse.win.y - previousMouseY) / 100; }
			previousMouseY = HE.mouse.win.y; // Reset Cache
		} else {
			HE.mouse.ff.y = 0; // No movement so no force feedback
		}

		// Detect horizontal movement
		if (previousMouseX !== HE.mouse.win.x) {
			// Get force feedback
			if (!firstRun) {HE.mouse.ff.x = (HE.mouse.win.x - previousMouseX) / 100; }

			previousMouseX = HE.mouse.win.x; // Reset Cache
		} else {
			HE.mouse.ff.x = 0; // No movement so no force feedback
		}

		HE.onMouseMove(); // Run User's Custom Code
		lockMouseUpdate = false; // Unlock function to be able to run again
	}

	/** updateScroll (function) Private
	 *	This function calculates scroll positions, it is called when the window is scrolled by the user
	 *  For performance reasons, it is only called with requestAnimationFrame and only if it isn"t already running
	 */
	function updateScroll() {
		// Perform calculations about current position in website
		HE.scroll.px.x = window.pageXOffset;
		HE.scroll.px.y = window.pageYOffset;

		// Console messages for developers
		if (developmentLog) {
			console.log("HE.scroll px{x:"+HE.scroll.px.x+", y:"+HE.scroll.px.y+"}, pct {x:"+HE.scroll.pct.x+", y:"+HE.scroll.pct.y+"}, ff{x:"+HE.scroll.ff.x+", y:"+HE.scroll.ff.y+"}");
		}

		// HTML messages for developers
		if(developmentElement){
			$("#HE .s").text("HE.scroll px{x:"+HE.scroll.px.x+", y:"+HE.scroll.px.y+"}, ff{x:"+HE.scroll.ff.x+", y:"+HE.scroll.ff.y+ "}, pct{x:"+HE.scroll.pct.x+", y:"+HE.scroll.pct.y+"}");
		}

		// Detect vertical movement
		if (previousScrollY !== HE.scroll.px.y) {
			// Get force feedback
			if(!firstRun){HE.scroll.ff.y = HE.scroll.px.y - previousScrollY; }

			// Reset Cache
			previousScrollY = HE.scroll.px.y;

			// Calculate Percentage unless it would divide by zero
			if(scrollableY !== 0) {
				HE.scroll.pct.y = HE.scroll.px.y / scrollableY;
			} else {
				HE.scroll.pct.y = 1;
			}

		} else {
			//HE.scroll.ff.y = 0; // No movement so no force feedback
		}

		// Detect horizontal movement
		if (previousScrollX !== HE.scroll.px.x) {
			// Get force feedback
			if(!firstRun){HE.scroll.ff.y = HE.scroll.px.y - previousScrollY; }

			// Reset Cache
			previousScrollX = HE.scroll.px.x;

			// Calculate Percentage unless divide by zero
			if(scrollableX !== 0){
				HE.scroll.pct.x = HE.scroll.px.x / scrollableX;
			} else {
				HE.scroll.pct.x = 1;
			}

		} else {
			//HE.scroll.ff.y = 0; // No movement so no force feedback
		}

		HE.onScroll(); // Run User"s Code
		lockScrollUpdate = false; // Unlock function to be able to run again
	}

	// Request scroll/resize if not already running
	function scrollRequest() {if(!lockScrollUpdate) {lockScrollUpdate = true; requestAnimationFrame(updateScroll); }}
	function resizeRequest() {if(!lockWindowUpdate){lockWindowUpdate = true; requestAnimationFrame(updateWindow); }}

	// Request mouse movement if not already running
	function mouseRequest(e) {
		if(!lockMouseUpdate){
			lockMouseUpdate = true;
			HE.mouse.doc.x = e.pageX;
			HE.mouse.doc.y = e.pageY;
			HE.mouse.win.x = e.screenX;
			HE.mouse.win.y = e.screenY;

			// Normalize to get best possible target selector as string
			if (e.target.id) {
				HE.mouse.target = "#" + e.target.id;
			} else if (e.target.className) {
				HE.mouse.target = "." + e.target.className;
			} else if (e.target.tagName) {
				HE.mouse.target = "" + e.target.tagName;
			} else {
				HE.mouse.target = "body";
			}
			HE.mouse.target = HE.mouse.target.toLowerCase(HE.mouse.target);

			requestAnimationFrame(updateMouse);
		}
	}

	HE.init = function(allowMouseTracking, consoleMessages, elementMessages){
		if(consoleMessages){developmentLog = true;} //console Logs
		if(elementMessages){developmentElement = true;$("body").append("<ul id=\"HE\" style=\"position:fixed;top:0;left:0;z-index:9999;background:rgba(0,0,0,.5);margin:0;padding:15px;color:#fff\"><li class=\"r\"></li><li class=\"s\"></li><li class=\"m\">mouse tracking disabled, to all enable features, use HE.init(1,1,1);</li></ul>");} //show element on screen with info

		// don't break old IE's
		if ("addEventListener" in window) {
			window.addEventListener("resize", resizeRequest, true);
			window.addEventListener("resize", scrollRequest, true);
			window.addEventListener("scroll", scrollRequest, true);
		}
		updateScroll();
		updateWindow();

		// if allowMouseTracking === true, allow mouse tracking
		if (allowMouseTracking) {
			$body.mousemove(function(e){mouseRequest(e); });

			// It"s currently impossible to know a mouse"s coordinates until it"s moved,
			// it"s more likely to be somewhere in the middle of the window
			// vs the very top left pixel of the screen.
			// http://stackoverflow.com/questions/2601097/how-to-get-the-mouse-position-without-events-without-moving-the-mouse
			mouseRequest({pageX: HE.size.win.x/2,pageY: HE.size.win.y/2,screenX: HE.size.win.y/2,screenY: HE.size.win.x/2,target: "body"});
		}
		firstRun = false; // Initial values are set
	};
}(jQuery));

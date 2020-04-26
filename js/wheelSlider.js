;(function($) {

	// Options
	var defaults = {
		itemClass     : 'wheelSlider-item',
	    arrowClass    : 'wheelSlider-arrow',
	    arrowPrevHtml : '<span></span>',
	    arrowNextHtml : '<span></span>',
	    mode	      : 'horizontal',
	    items 	      : 3,
	    startSlide    : 0,
	    dots 	      : false,
	    controls      : false,
	    auto 	      : false,
	    pause 	      : 3000,
	    autoHover     : false,

	    // Callbacks
	    onSliderLoad   : function() { return true },
	    onSlideBefore  : function() { return true },
	    onSlideAfter   : function() { return true },
	    onSlideNext    : function() { return true },
	    onSlidePrev    : function() { return true },
	    onSliderResize : function() { return true }
	}


	$.fn.wheelSlider = function(options) {

		if (this.length === 0) {
			return this
		}

		// Support multiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).wheelSlider(options)
			})

			return this
		}

		// Create a namespace to be used throughout the plugin
		var slider = {},
			el = this,
			$el = $(this)


		// Return if slider is already initialized
    	if ($el.data('wheelSlider')) { return }


    	/**
		* ===================================================================================
		* = PRIVATE FUNCTIONS
		* ===================================================================================
		*/
    	var init = function() {
    		// Merge user-supplied options with the defaults
    		slider.settings = $.extend({}, defaults, options)

    		// Store the original children
    		slider.children = $el.find('.' + slider.settings.itemClass)

    		// Store active slide information
    		slider.active = { index: slider.settings.startSlide }

    		// Initialize the controls object
    		slider.controls = {}

    		// Initialize the dots object
    		slider.dots = {}

    		// Initialize an auto interval
      		slider.interval = null

    		// Store the item counts
    		slider.itemCount = slider.children.length

    		// If controls are requested, add them
    		if (slider.settings.controls) { appendControls() }

    		// If dots are requested, add them
    		if (slider.settings.dots) { appendDots() }

    		// If auto is true and has more than 1 slide, start the show
    		if (slider.settings.auto  && slider.itemCount > 1) { initAuto() }

    		start()
    	}


    	// Start the slider
    	var start = function() {
    		// Set slides position
    		setSlidePosition( slider.settings.startSlide )

    		// Setup the touch events
    		initTouch()

    		// Slider has been fully initialized
    		slider.initialized = true

    		// Add click actions to the slide
    		slider.children.on('click touchend', clickSlide)

    		// onSliderLoad callback
    		slider.settings.onSliderLoad.call(el, slider.active.index)

    		// Add the resize call to the window
    		$(window).on('resize', resizeWindow)

    		// Set height for container
    		$el.height( setContainerHeight() ).addClass('loaded')
    	}


    	// Appends prev / next controls
    	var appendControls = function() {
      		slider.controls.prev = $('<button class="'+slider.settings.arrowClass+'" data-action="prev">'+slider.settings.arrowPrevHtml+'</button>')
    		slider.controls.next = $('<button class="'+slider.settings.arrowClass+'" data-action="next">'+slider.settings.arrowNextHtml+'</button>')

      		// Add the control elements to the container
      		$el.append( slider.controls.prev ).append( slider.controls.next )

      		// Add click actions to the controls
      		slider.controls.next.on('click touchend', el.goToNextSlide)
      		slider.controls.prev.on('click touchend', el.goToPrevSlide)
    	}


    	// Appends the dots
    	var appendDots = function() {
    		// Create the dots DOM element
    		slider.dots = $('<div class="dots" />')

    		let dotsHtml = ''
	        let i = 0

	        // Loop through each dots item
	        while ( i < slider.itemCount ) {
	            dotsHtml += '<button class="dot" data-slide-index="'+ i +'">'+ (i+1) +'</button>'
	            i++
	        }

	        // Add class for container
      		$el.append( slider.dots ).addClass('with_dots')

      		// Add the dots to the container
      		slider.dots.html( dotsHtml )

      		// Add click actions to the dots
      		slider.dots.on('click touchend', 'button', clickDot)
    	}


    	// Sets the slider's position
    	var setSlidePosition = function(nowIndex) {
    		// onSlideBefore callback
    		if( slider.initialized ) {
    			slider.settings.onSlideBefore.call(el, nowIndex)
    		}

    		// Clern all class
            $el.find('.now').removeClass('now')
            $el.find('.next').removeClass('next')
            $el.find('.prev').removeClass('prev')
            $el.find('.first').removeClass('first')
            $el.find('.last').removeClass('last')

            // Adding classes
        	if(nowIndex == slider.itemCount -1){
                slider.children.eq(0).addClass('next')
            }

            if(nowIndex == 0) {
                slider.children.eq(slider.itemCount -1).addClass('prev')
            }

            // For 5 slides
            if( slider.settings.items == 5 ) {
            	if(nowIndex == 0) {
	                slider.children.eq(slider.itemCount -2).addClass('first')
	            }

	            if(nowIndex == 1){
	                slider.children.eq(slider.itemCount -1).addClass('first')
	            }

	            if(nowIndex == slider.itemCount -1){
	                slider.children.eq(1).addClass('last')
	            }

	            if(nowIndex == slider.itemCount -2){
	                slider.children.eq(0).addClass('last')
	            }
            }

            slider.children.each(function(index) {
                if( index == nowIndex ) {
                    slider.children.eq(index).addClass('now')
                }

                if( index == nowIndex + 1 ) {
                    slider.children.eq(index).addClass('next')
                }

                if( index == nowIndex - 1 ) {
                    slider.children.eq(index).addClass('prev')
                }

	            // For 5 slides
            	if( slider.settings.items == 5 ) {
	                if( index == nowIndex + 2 ) {
	                    slider.children.eq(index).addClass('last')
	                }

	                if( index == nowIndex - 2 ) {
	                    slider.children.eq(index).addClass('first')
	                }
	            }

                // Set new index
                slider.active.index = nowIndex

                // If dots is requested, make the appropriate dots active
                if (slider.settings.dots) { updateDotsActive(nowIndex) }

                // onSlideAfter callback
                if( slider.initialized ) {
    				slider.settings.onSlideAfter.call(el, slider.active.index)
    			}
            })
    	}


    	// Updates the dots links with an active class
		var updateDotsActive = function(slideIndex) {
			// Remove active class
			slider.dots.find('button').removeClass('active')

			// Add active class
			slider.dots.find('button').eq(slideIndex).addClass('active')
		}


		// Add click actions to the slide
		var clickSlide = function(e) {
			let slide = $(e.currentTarget)
			let slideIndex = slide.index()

			// Сlick only on an inactive slide
			if ( slideIndex != slider.active.index ) {
				e.preventDefault()

				// Continue with the goToSlide call
				el.goToSlide(slideIndex)
			}
		}


		// Click on dot
		var clickDot = function(e) {
			e.preventDefault()

			dotLink = $(e.currentTarget)

			if (dotLink.data('slide-index') !== undefined) {
				// Get new slide index
				dotIndex = parseInt(dotLink.data('slide-index'))

				// Continue with the goToSlide call
				if (dotIndex !== slider.active.index) { el.goToSlide(dotIndex) }
			}
		}


		// Initializes the auto process
		var initAuto = function() {
			// Start the auto show
			el.startAuto()

			// if autoHover is requested
      		if (slider.settings.autoHover) {
      			el.hover(function() {
      				if (slider.interval) {
			            // Stop the auto show
			            el.stopAuto()

			            // Create a new autoPaused value which will be used by the relative "mouseout" event
			            slider.autoPaused = true
		          	}
      			}, function() {
      				if (slider.autoPaused) {
      					// Start the auto show
      					el.startAuto()

      					// Reset the autoPaused value
            			slider.autoPaused = null
      				}
      			})
      		}
		}


		// Initializes touch events
		var initTouch = function() {
			var ts

			// Event handler for "touchstart"
	        el.on('touchstart', function(e) {
				ts = e.originalEvent.touches[0].clientX;
			})

	        // Event handler for "touchend"
	        el.on('touchend', function(e) {
				let te = e.originalEvent.changedTouches[0].clientX;

				if(ts > te+5) {
					// Continue with the goToNextSlide call
					el.goToNextSlide(e)
				} else if(ts < te-5) {
					// Continue with the goToPrevSlide call
					el.goToPrevSlide(e)
				}
			})
		}


		// Window resize event
		var resizeWindow = function() {
			// Don't do anything if slider isn't initialized
			if (!slider.initialized) { return }

			// Update height for container
			$el.height( setContainerHeight() )

			// onSliderResize callback
		    slider.settings.onSliderResize.call(el, slider.active.index)
		}


		// Еhe computation of the greatest height of slide
		var setContainerHeight = function() {
			let maxheight = 0

			slider.children.each(function(){
				let elHeight = $(this).innerHeight()

		        if( elHeight > maxheight ) {
		        	maxheight = elHeight
		        }
			})

			return maxheight
		}


		/**
		* ===================================================================================
		* = PUBLIC FUNCTIONS
		* ===================================================================================
		*/

		// Transitions to the next slide
		el.goToNextSlide = function(e) {
			if(e){
				e.preventDefault()
			}

			if( slider.active.index == slider.itemCount - 1 ) {
				// Set slides position
                setSlidePosition(0)
            } else {
            	// Set slides position
                setSlidePosition( slider.active.index + 1 )
            }

            // onSlideNext callback
            slider.settings.onSlideNext.call(el, slider.active.index)
		}

		// Transitions to the prev slide
		el.goToPrevSlide = function(e) {
			e.preventDefault()

			if( slider.active.index == 0 ) {
				// Set slides position
                setSlidePosition( slider.itemCount - 1 )
            } else {
            	// Set slides position
                setSlidePosition( slider.active.index - 1 )
            }

            // onSlidePrev callback
            slider.settings.onSlidePrev.call(el, slider.active.index)
		}


		// Performs slide transition to the specified slide
		el.goToSlide = function(slideIndex) {
			// Set slides position
			setSlidePosition(slideIndex)
		}


		// Starts the auto show
		el.startAuto = function() {
			// If an interval already exists, disregard call
			if (slider.interval) { return }

			// Create an interval
      		slider.interval = setInterval(function() {
      			// Continue with the goToNextSlide call
      			el.goToNextSlide()
      		}, slider.settings.pause)
		}


		// Stops the auto show
		el.stopAuto = function() {
			// if no interval exists, disregard call
      		if (!slider.interval) { return }

      		// Clear the interval
      		clearInterval(slider.interval)
      		slider.interval = null
		}


		// Returns current slide element
		el.getCurrentSlide = function() {
			return Number(slider.active.index)
		}


		// Returns number of slides in show
		el.getSlideCount = function() {
			return Number(slider.children.length)
		}


		init()

	    $el.data('wheelSlider', this)

	    // Returns the current jQuery object
	    return this
	}

})(jQuery)
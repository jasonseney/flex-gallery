// # Eager Load
// 
// Recursively loads an ARRAY of image links.
// When you later request them, they'll be cached!
//
// @requires jQuery
(function($) {
    // Setup Special Load Event
    $.event.special.load = {
		add: function (hollaback) {
			if ( this.nodeType === 1 && this.tagName.toLowerCase() === 'img' && this.src !== '' ) {
				// Image is already complete, fire the hollaback (fixes browser issues were cached
				// images isn't triggering the load event)
				if ( this.complete || this.readyState === 4 ) {
					hollaback.handler.apply(this);
				}

				// Check if data URI images is supported, fire 'error' event if not
				else if ( this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0 ) {
					$(this).trigger('error');
				}
				
				else {
					//$(this).bind('load', hollaback.handler);
				}
			}
		}
	};
    
    // @param links An array of strings (urls) to load as imgs
    // @param onLoadEach A callback for each image after it completes (loaded or failed)
    // @param onLoadAll A callback for after all images complete
    $.eagerLoad  = function(links, onLoadEach, onLoadAll) {

		var log = function(message) { 
            if (typeof (console) != 'undefined' && window.console) {
                console.log(message);
            }
        };         

        var counter = links.length;
        var cache = [];
        onLoadEach = onLoadEach || function() { };
        onLoadAll = onLoadAll || function() { };

        var loadImage = function(index, limit) {

            if(index >= limit) { return; }

            var imageEnded = function(completedImage) {
                counter--;
                onLoadEach.apply(completedImage);

                if(counter == 0) {
                    onLoadAll.apply(cache);
                }
            };

            log("Starting Image: " + links[index]); 

            var img = document.createElement('img');

            $(img).load(function() {
                log("Preloaded Image: " + links[index]); 
                imageEnded(this);
            })
            .bind("error", function() {
                log("Failed Image: " + links[index]); 
                imageEnded(this);
            });

            img.src = links[index];
            cache.push(img);

            // Delay so we don't lockup browser each load
            setTimeout(function() {
                loadImage(index + 1, limit);
            }, 200);	

        };

        loadImage(0, links.length);

    };
})(jQuery);


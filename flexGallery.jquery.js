(function($) {
    // Module for a flexible gallery
    //
    // @param holder The element to contain images and stretch to
    // @param imageUrls A list of urls to images for slides
    // @param options.mode The mode to display images. Either "contain" (default) or "cover".
    // @param options.slideTime The time between slides. 0 to disable timer
    // @param options.onLoad A callback for when the gallery is loaded
    // @param options.transition A function for tranistion between slides
    $.flexGallery = function(holder, imageUrls, userOptions) {

        var options = {
            mode: "contain",
            slideTime: 0,
            onLoad : function(){},
            transition: function(currIndex,index,curr,next) {
                $(curr).fadeTo(500,0.0);
                $(next).fadeTo(500,1.0);
            }
        };

        $.extend(options,userOptions);

        // Helper to verify we have everything we need
        var verifyDependency = function(func, name, level) {
            level = level || "warn";
            if(!func) {
                console[level]("Missing dependency: " + name);
                return false;
            }
            return true;
        };

        if(!verifyDependency($.slidesModule, "slidesModule.jquery.js", "error") ||
            !verifyDependency($.eagerLoad, "eagerLoad.jquery.js", "error")) {
                return;
        }

        var obj = this;
        var images = null;

        // Handles resizing images based on the holder size
        var refreshView = function(imgs) {

            var windowH = $(holder).height();
            var windowW = $(holder).width();
            var windowAspect = windowW / windowH;

            $(imgs).each(function() {
                var imgH = $(this).height();
                var imgW = $(this).width();
                var imgAspect = imgW / imgH

                // Full height, centered horizontally
                if(windowAspect > imgAspect && imgAspect > 0) {
                    
                    // Calculate the rendered width as it is stretched automatically
                    // Use this for centering 
                    var renderedW = Math.floor(windowH * imgAspect);

                    $(this).height(windowH);
                    $(this).width("auto");
                    $(this).css("top", 0);
                    $(this).css("left", Math.floor(windowW/2 - renderedW/2));
                }
                // Full width, centered vertically
                else if(windowAspect <= imgAspect) {
                    
                    // Calculate the rendered height as it is stretched automatically
                    // Use this for centering 
                    var renderedH = Math.floor(windowW / imgAspect);

                    $(this).css("width", windowW);
                    $(this).css("height", "auto");
                    $(this).css("left", "0");
                    $(this).css("top", Math.floor(windowH/2 - renderedH/2));
                }
            });
        };

        var setupImages = {
            "contain": function(urls,elements) {
                images = elements;

                $(holder).append(images);

                $(images).css({ 
                    "display":"block",
                    "position":"absolute",
                    "top":"0",
                    "left":"0"
                }).fadeTo(0,0);

                refreshView(images);
            },
            "cover": function(urls,elements) {
                images = $.map(urls, function(url,index) {
                    return $("<div class='image-"+index+"' style='background-image: url("+url+");'></div>").get(0);
                });

                $(holder).append(images);

                $(images).css({ 
                    "background-position": "center",
                    "background-size": "cover",
                    "background-repeat": "no-repeat",
                    "display":"block",
                    "position":"absolute",
                    "top":"0",
                    "left":"0",
                    "width": "100%",
                    "height": "100%"
                }).fadeTo(0,0);
            }
        };

        // Setup
        var setupGallery = function() {

            $(holder).css("overflow","hidden");

            setupImages[options.mode](imageUrls, this);

            obj.slides = new $.slidesModule(images, options.slideTime, options.transition);
            obj.slides.goto(0);

            options.onLoad.apply(obj, images);
        };

        // ******** MAIN *********

        // Refresh view on resizes
        if(options.mode == "contain" && verifyDependency(jQuery.fn.debounceresize, "debouncedEvents.jquery.js")) {
            $(window).debounceresize(function() {
                if(images) { refreshView(images); }
            });
        }

        // Swipe Events
        if(verifyDependency(jQuery.fn.swipe, "jQuery.touchSwipe.js")) {
            $(holder).swipe({
                swipeLeft : function(event, direction, distance, duration, fingerCount) {
                    obj.slides.next();
                    obj.slides.timer.disable();
                },
                swipeRight : function(event, direction, distance, duration, fingerCount) {
                    obj.slides.prev();
                    obj.slides.timer.disable();
                }
            });
        }

        // Preload all images then run setup
        $.eagerLoad(imageUrls, function(){}, setupGallery);

        return obj;
    };
        
})(jQuery); 

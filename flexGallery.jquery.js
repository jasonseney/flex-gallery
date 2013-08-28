(function($) {
    $.flexGallery = function(holder, imageUrls, slideTime, onLoad, transition) {

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

        var transition = transition || function(index,curr,next) {
            $(curr).fadeTo(400,0);
            $(next).fadeTo(800,1);
        };

        // Resizing
        if(verifyDependency(jQuery.fn.debounceresize, "debouncedEvents.jquery.js")) {
            $(window).debounceresize(function() {
                if(images) { refreshView(images); }
            });
        }

        // Swipe Events
        if(verifyDependency(jQuery.fn.swipe, "jQuery.touchSwipe.js")) {
            holder.swipe({
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

        // Setup
        $.eagerLoad(imageUrls, function() {
        }, function() {
            images = this;

            holder.append(images);
            $(images).css("display","block");
            $(images).css("position","absolute");
            $(images).hide();
            refreshView(images);

            obj.slides = new $.slidesModule(images, slideTime, function() {}, transition);
            obj.slides.goto(0);

            onLoad.apply(obj);
            
        });

        return obj;
    };
        
})(jQuery); 

(function($) {
    $.flexGallery = function(holder, imageUrls, slideTime, onLoad) {

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
                var imgAspect = $(this).width() / imgH;

                // Full height, centered horizontally
                if(windowAspect > imgAspect && imgAspect > 0) {
                    $(this).height(windowH);
                    $(this).css("padding-top", 0);
                    $(this).css("width","auto");
                    $(this).css("margin", "0 auto");
                }
                // Full width, centered vertically
                else if(windowAspect <= imgAspect) {
                    $(this).css("width","100%");
                    $(this).css("height", "auto");
                    $(this).css("padding-top", Math.floor((windowH - windowW/imgAspect) / 2));
                }
            });
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
            $(images).hide();
            refreshView(images);

            obj.slides = new $.slidesModule(images, slideTime, function() {});
            obj.slides.goto(0);

            onLoad.apply(obj);
            
        });

        return obj;
    };
        
})(jQuery); 

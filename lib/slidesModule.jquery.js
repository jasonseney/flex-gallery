// # Slides Module
//
// Provides basic logic for handling a set of slide items. Includes optional inverval timer.
//
// @param items A set of items that are the "slides"
// @param interval Time in milliseconds for timer. Set to false or 0 to disable.
// @param callback A callback to be executed after switching to a new slide.
// @param transitionFunction A function for the visual effect of swtiching slides. Defaults to fade in/out. 3 parameters are available: index, current item, and next item.
//
// @return An object with access to the following public functions and objects: next, prev, goto, timer.
(function($) {
    $.slidesModule = function(items, interval, callback, transitionFunction) {

        var currentIndex = 0;
        var count = $(items).length;

        if (count < 2) { return; }

        var currentItem = $(items).eq(0);

        var prev = function() {
            if(currentIndex > 0) {
                switchTo(currentIndex - 1);
            }
        };
        var next = function() {
            if(currentIndex + 1 < count) {
                switchTo(currentIndex + 1);
            }
            else {
                switchTo(0);
            }
        };

        var switchTo = function(index) {

            nextItem = $(items).eq(index);

            if(transitionFunction) {
                transitionFunction(index, currentItem, nextItem);
            }
            else {
                $(currentItem).fadeOut("fast", function() {
                    $(nextItem).fadeIn("fast");
                });
            }

            if(callback) {
                callback(index, currentItem, nextItem);
            }

            currentIndex = index;
            currentItem = nextItem
        };
        
        // Runs the slide changes on a timeout interval
        var slideTimer = (function() {

            var timer;
            var timerInterval;
            var enabled = true;

            var slideNext = function() {
                if (enabled) { 
                    next();
                }
            };

            // Public access to the timer's controls
            var timerControl = {
                init: function(interval) {
                    timerInterval = interval;
                    return this;
                },
                start: function() {
                    if (enabled) {
                        if (timer) {
                            clearInterval(timer);
                        }
                        timer = setInterval(slideNext, timerInterval);
                    }
                    return this;
                },
                stop: function() {
                    if (timer) { clearInterval(timer); }
                    return this;
                },
                disable: function() {
                    enabled = false;
                    timerControl.stop();
                    return this;
                },
                enable: function() {
                    enabled = true;
                    return this;
                }
            };

            return timerControl;

        })();
        
        if(interval) {
            slideTimer.init(interval);
            slideTimer.start();
        }

        return {
            next : next,
            prev : prev,
            goto: switchTo,
            timer : slideTimer
        }
    };
})(jQuery);

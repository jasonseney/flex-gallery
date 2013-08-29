// # Slides Module
//
// Provides basic logic for handling a set of slide items. Includes optional inverval timer.
//
// @param items A set of items that are the "slides"
// @param interval Time in milliseconds for timer. Set to false or 0 to disable.
// @param onChange A callback to be executed after switching to a new slide. 4 parameters are available: currIndex, index, current item, and next item.
//
// @return An object with access to the following public functions and objects: next, prev, goto, timer.
(function($) {
    $.slidesModule = function(items, interval, onChange) {

        var currentIndex = 0;
        var count = $(items).length;

        if (count < 2) { return; }

        var currentItem = $(items).eq(0);

        var prev = function(options) {
            if(currentIndex > 0) {
                switchTo(currentIndex - 1, options);
            }
        };
        var next = function(options) {
            if(currentIndex + 1 < count) {
                switchTo(currentIndex + 1, options);
            }
            else {
                switchTo(0,options);
            }
        };

        var switchTo = function(index, options) {

            nextItem = $(items).eq(index);

            if(onChange) {
                onChange(currentIndex,index, currentItem, nextItem, options);
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

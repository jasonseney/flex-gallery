Flex Gallery
============

A flexible gallery module that stretches to it's container. Supports a built in timer, swipe integration, and browser resize refresh.

### Dependencies (see lib folder)

Required 

- jQuery
- jQuery.slidesModule
- jQuery.eagerLoad

Suggested

- jQuery.fn.touchSwipe
- jQuery.fn.debounceresize

### Usage

    var galleryInstance = $.flexGallery(containerElement,imageUrlArray, [intervalTime], [onLoadCallback],[transitionFunction]);

*See the demo for full usage example*

##### Public API

galleryInstance.slides.prev()
galleryInstance.slides.next()
galleryInstance.slides.goto(index)
galleryInstance.slides.timer.enable()
galleryInstance.slides.timer.disable()

### Notes

The gallery will not load until all of the images have been downloaded and positioned. This might not be ideal for a gallery with a lot of images, but is the simplest solution for the time being.

The module does not apply any CSS beyond what is required to stretch the slides. Sizing CSS on the container element is required by the user.

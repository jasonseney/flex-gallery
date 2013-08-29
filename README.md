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

    $.flexGallery(containerElement,imageUrls, [options])

- **containerElement**  
    Type: *Element*  
    The element in which to hold slides.
- **imageUrls**  
    Type: *Array*    
    An array that holds the image urls, one for each slide
- **options**  
    Type: *Object*  
    Set of options to override specific behaviors
    - **mode**   
        Type: *String* - "contain" (default) or "cover"  
        The mode in which to render each image inside the container. Setting to "contain" will position each image to stretch to the container size while preserving aspect ratio. Setting to "cover" will apply the image as a CSS background set to `background-position:cover` - cropping the image and filling the entire container.
    - **startIndex**  
        Type: *Number*
        The index to start the slideshow on. Defaults to 0.
    - **slideTime**  
        Type: *Number*
        The time in milliseconds between slides. Set to false or 0 to disable (default).
    - **onLoad**  
        Type: *Function*(*Array* images)  
        A callback function called after gallery loads. `this` is a reference to the gallery object. `images` is an array of the generated image slides.
    - **transition**  
        Type: *Function*(*Number* currIndex, *Number* index, *Element* currItem, *Element* nextItem, *Object* transitionOptions)  
        A function to control to override how slides are transitioned. If overriding this option, the user will be responsible for showing/hiding/moving/manipulating both the current and next slide. `transitionOptions` are passed through from the `slides.goto` function.

*See the demo for full usage example*

##### Public API

- galleryInstance.slides.prev(*Object* options)
- galleryInstance.slides.next(*Object* options)
- galleryInstance.slides.goto(*Number* index, *Object* options)
- galleryInstance.slides.timer.enable()
- galleryInstance.slides.timer.disable()

### Notes

The gallery will not load until all of the images have been downloaded and positioned. This might not be ideal for a gallery with a lot of images, but is the simplest solution for the time being.

The module does not apply any CSS beyond what is required to stretch the slides. Sizing CSS on the container element is required by the user.

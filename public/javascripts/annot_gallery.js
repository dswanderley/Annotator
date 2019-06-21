
/*
 * Gallery
 */

// Global variables
var galleryURL = 'gallery/';
// dataset
var imageList = [];
// current image
var im_obj = null;
var img_id = -1;

/*
 * GET AJAX
 */

function loadGallery() {
    /** @description Load Gallery of images
     */
    $('.loader').show();
    // Gallery URL
    url_g = urlBase + '/annot/gallery';

    // Ajax call
    $.ajax(
        {
            type: 'GET',
            url: url_g,
            data: { id: '0' },
            dataType: 'json',
            cache: false,
            async: true,
            success: function (data) {
                // reset List of images in gallery
                imageList = [];
                i = 0;
                let idx = 0;            
                // Read images in gallery folder
                data.gallery_list.forEach(file => {
                    // Get last annotation. Verify later with collection properties.
                    if (file.annotations !== undefined) {
                        // Define image ID
                        idx = i;
                    }                    
                    // Add filename to gallery list
                    imageList.push(file);
                    i += 1;
                });
                // Add list to gallery
                selectGalleryImage(idx);
                updatePercentage();
            }
        });
}


/*
 * Load Gallery
 */

function selectGalleryImage(id) {
    /** @description Change large image after click on image gallery
      * @param {string} image Image Element Id
     */

    img_id = id;
    im_obj = imageList[id];
    currentSrc = galleryURL + im_obj.filename;
    resetAnotation();
    initCanvas(currentSrc);
}

function identImage(direction) {
    /** @description Change large image after click on image gallery
      * @param {int} direction Direction of changes
     */
    if (direction > 0 && img_id < imageList.length - 1) {
        selectGalleryImage(img_id + 1);
    }
    else if (direction < 0 && img_id > 0) {
        selectGalleryImage(img_id - 1);
    }
    else {
        return;
    }
    // Update image value
    updateImageIndex();
}

function jumpImage(direction) {
    /** @description Select images from gallery ends
      * @param {int} direction Direction of changes
     */
    if (direction > 0 && img_id < imageList.length - 1) {
        selectGalleryImage( imageList.length - 1);
    }
    else if (direction < 0 && img_id > 0) {
        selectGalleryImage(0);
    }
    else {
        return;
    }
    // Update image value
    updateImageIndex();
}

function updateImageIndex() {
    /** @description Update image index on progress bar
     */
    // Update image value
    let  bar = $(".progress-bar")[0];
    bar.innerText = txt = (img_id + 1) + "/" + imageList.length;
}

function updatePercentage() {
    /** @description Update image index on progress bar
     */    
    // Count annotations
    let total = 0;
    for (let i = 0; i < imageList.length; i++) {
        if (imageList[i].annotations !== undefined)
            total++;
    }
    // Update progress bar
    let  bar = $(".progress-bar")[0];
    let percentage = 100 * total / imageList.length;
    if (percentage < 0.5)
        percentage = 0.5;
    bar.setAttribute("aria-valuenow", percentage);
    bar.style.width = percentage + "%";
}
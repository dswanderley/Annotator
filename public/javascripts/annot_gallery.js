
/*
 * Gallery
 */

// Global variables
var galleryURL = 'gallery/';
// dataset
var imageList = [];
// current image
var im_obj = null;

/*
 * GET AJAX
 */

function loadGallery() {
    /** @description Load Gallery of images
     */
    $('.loader').show();
    // Load Gallery Div
    var gallery = $('#gallery');
    // Create gallery ul - unordered list
    var el_ul = jQuery('<ul/>', {
        class: 'galery-ul'
    });
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
                
                // Read images in gallery folder
                data.gallery_list.forEach(file => {
                    // Define image ID
                    img_id = i;
                    // Create each image element - list item
                    //el_ul.append(getGalleryEl(img_id, file.filename));
                    // Add filename to gallery list
                    imageList.push(file);
                    i += 1;
                });
                
                // Add list to gallery
                //gallery.append(el_ul);
                selectGalleryImage(0);
                
                // Set orginal image block with the first image on gallery
                
                //current_idx = idx;
        
            }
        });
}


/*
 * Load Gallery
 */


function selectGalleryImage(imgid) {
    /** @description Change large image after click on image gallery
      * @param {string} image Image Element Id
     */
    im_obj = imageList[imgid];
    currentSrc = galleryURL + im_obj.filename;
    resetAnotation();
    initCanvas(currentSrc);
}




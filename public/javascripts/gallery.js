
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
    url_g = urlBase + '/gallery';

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
                    el_ul.append(getGalleryEl(img_id, file.filename));
                    // Add filename to gallery list
                    imageList.push(file);
                    i += 1;
                });
                // Add list to gallery
                gallery.append(el_ul);
                
                // Set orginal image block with the first image on gallery
                
                //current_idx = idx;
        
            }
        });
        document.getElementById("gallery").style.cursor='default';
}


/*
 * Load Gallery
 */


function getGalleryEl(id, img) {
    /** @description Get image element for the gallery
      * @param {string} id id
      * @param {string} img name
      * @return {jQuery} list item
     */
    var img_name=img.substr(0,img.lastIndexOf("_"));
    // Create list item
    el_li = jQuery("<li/>", {
        class: "gallery-img",
        onclick: "selectGalleryImage(" + id + ")",
        text: img_name,     
    });
    // Create image element
    el_img = jQuery("<img/>", {
        class: "gallery-thumb",
        id: id,
        src: galleryURL + img,        
    });
    // Add image to list item
    el_li.append(el_img);
    return el_li;
}

function selectGalleryImage(imgid) {
    /** @description Change large image after click on image gallery
      * @param {string} image Image Element Id
     */
    im_obj = imageList[imgid];
    currentSrc = galleryURL + im_obj.filename;
    resetAnotation();
    initCanvas(currentSrc);
}




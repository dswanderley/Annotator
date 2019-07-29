
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
    let us_type = "ovary";

    // Ajax call
    $.ajax(
        {
            type: 'GET',
            url: url_g,
            data: { us_type: us_type },
            dataType: 'json',
            cache: false,
            async: true,
            success: function (data) {
                // List of images in gallery
                imageList = data.gallery_list;
                // Add list to gallery
                selectGalleryImage(data.start_idx);
                updatePercentage();
                $(".blind-screen").hide();
            }
        });
}


/*
 * Load Gallery
 */

function getImageAnnotations(temp_el) {
    /** @description Set imageList global variable adding canvas offset to originalPoints.
      * @param {Array} imlist List of data of images
     */

    // Check if annotations exist
    if (typeof(temp_el.annotations) === "object" || typeof(temp_el.annotations) === "Array") {
        // Read annotations classes
        for (let j = 0; j < temp_el.annotations.length; j++) {
            let annot_class = temp_el.annotations[j];
            // Read each annotation point
            for (let k = 0; k < annot_class.length; k++) {
                let annot_el = annot_class[k];
                // Read original points
                for (let p = 0; p < annot_el.originalPoints.length; p++) {
                    // Sum offset
                    annot_el.originalPoints[p].x = (annot_el.originalPoints[p].x + csizes.canvasX) / canvasScale;
                    annot_el.originalPoints[p].y = (annot_el.originalPoints[p].y + csizes.canvasY) / canvasScale;
                }
                annot_class[k] = annot_el;
            }
            temp_el.annotations[j] = annot_class;
        }
    }
    
    return temp_el;
}

function selectGalleryImage(id) {
    /** @description Change large image after click on image gallery
      * @param {string} image Image Element Id
     */

    // Prevent edition mode
    if (flagMouseEvent === 2) {
        // Check if any button is selected
        if ($(".btn.btn-class-annot.btn-outline-info").length > 0)
            flagMouseEvent = 1;
        else
            flagMouseEvent = 0;
        // Verify if an edition is being performed
        if (smooth_temp instanceof SmoothPiecewise) {
            // Set segmentation
            setSegmentation(smooth_temp, 
                smooth_temp.profile.id, 
                smooth_temp.idSegment - 1);
            // Set main
            setDraw(smooth_temp.profile.id);
            smooth_temp = null;          
        }
    }

    // Set new image
    img_id = id;
    let temp_obj = copyObject(imageList[img_id]);
    // Pre-set canvas
    setCanvasSize(temp_obj.width, temp_obj.height);
    // Set image data with canvas offset
    im_obj = getImageAnnotations(temp_obj);
    // Reload canvas
    initCanvas();
}


/*
 * Gallery controls
 */

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
    let  bar = $(".progress-val")[0];
    bar.innerText = txt = (img_id + 1) + " / " + imageList.length;
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
    updateImageIndex();
}


/*
 * Draw objects
 */

function setAnotations() {
    /** @description Plot annotations
     */ 
    // Clear Content
    smoothpiecewises = [];
    smooth_temp = [];
    class_list = new Array(N_CLASSES);
    // Read content by class
    if (im_obj.annotations !== undefined) {
        let annots = im_obj.annotations;
        // Read elements inside class
        for (let i = 0; i < annots.length; i++) {
            // List of obj by class
            let class_array = [];
            // Load all class elements
            let class_anot = annots[i];
            for (let j = 0; j < class_anot.length; j++) { 
                // Loaded object
                let obj = class_anot[j];
                var arr = point2array(obj.originalPoints);
                // Set smooth obj
                let smooth = new SmoothPiecewise();
                smooth.originalPoints = obj.originalPoints;
                smooth.interpolatedPoints = getSmoothPiecewises(arr);
                smooth.profile = obj.profile;
                smooth.idSegment = obj.idSegment;
                // Push to list
                class_array.push(smooth);
                // Pushh all SmoothPiecewise objects
                smoothpiecewises.push(smooth);
            }
            // Fill list by class            
            class_list[i] = class_array;
        }
        redraw();
    }
    listAnnot();
}


/*
* Aux Functions
*/

function copyObject(obj) {
    /** @description Make a copy of a JSON
      * @param {object} obj JSON
     */
    return JSON.parse(JSON.stringify(obj));
  }
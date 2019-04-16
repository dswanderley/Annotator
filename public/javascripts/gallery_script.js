
/*
 * Gallery
 */

// Global variables
var galleryURL = 'gallery/';
// dataset
var imageList = [];
// current search
var search_image = null;
var search_patient = null;
var search_annotator = null;
var search_type = 'all';
var search_status = 'all';

function loadGallery() {
    $('[data-toggle="tooltip"]').tooltip();
}
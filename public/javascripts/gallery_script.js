
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
    dateRangePicker();
}


function dateRangePicker() {

    $('input[name="daterange"]').daterangepicker({
        opens: 'right'
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      });

}
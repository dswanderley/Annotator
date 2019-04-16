
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
    /** @description starts the gallery of images.
     */
    // Turn on tooltips bootstrap
    $('[data-toggle="tooltip"]').tooltip();
    // Turn on date ranger
    dateRangePicker();
}


function dateRangePicker() {
    /** @description set functions and default values of datarange fields.
     */
    $('input[name="daterange"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        },
        buttonClasses: "btn btn-sm",
        applyButtonClasses: "btn-info",
        cancelClass: "btn-default",
        drops: 'up',
        opens: 'right',
        minYer: 2017,
        maxYear: 2019
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      });

    $('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });
  
    $('input[name="daterange"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

}
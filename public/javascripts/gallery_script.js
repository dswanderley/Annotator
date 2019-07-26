
/*
 * Gallery
 */

// Global variables
var urlBase = "";
// dataset
var imageList = [];
// current search
var search_image = null;
var search_patient = null;
var search_annotator = null;
var search_type = 'all';
var search_status = 'all';


/*
 * Init page
 */

function loadGallery() {
    /** @description starts the gallery of images.
     */

    // Turn on tooltips bootstrap
    $('[data-toggle="tooltip"]').tooltip();
    // Turn on date ranger
    dateRangePicker();
    refreshPageSize();
    $('.blind-screen').hide();
    loadGallery();
}

function refreshPageSize() {
    /** @description Update useful field height
     */
        // Get element height
        let height_header = parseFloat($("header").css("height"));
        let height_footer = parseFloat($("footer").css("height"));
        let height_window = $(window).height();
        // Visual field available
        let height_body = height_window - height_footer - height_header;
        // Set gallery background height and scroll
        $('#gallery-col').css("overflow-y", "auto");
        $('#gallery-col').css("max-height", height_body + "px");
        // Set lateral menu background height
        $('.bg-full-fill').css('height', height_body + 'px');     
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



function loadGallery() {
    /** @description Load Gallery of images
     */
    $('.loader').show();
    // Gallery URL
    url_g = urlBase + '/gallery/search';

    // Ajax call
    $.ajax(
        {
            type: 'GET',
            url: url_g,
            data: { id: '0' },
            dataType: 'json',
            cache: false,
            async: true,
            success: function (images) {               
                imageList = images.gallery;
                setGallery();
                $('.blind-screen').hide();
            }
        });
}



/*
 * Button Management
 */

function setRadioBtn(btn) {
    /** @description Manage the example buttons 
    * @param {obj} Button
    */
    // Avoid double click
    if ($('#' + btn.id).hasClass('focus'))
        return;

    // Check if button is dr or quality
    if (btn.id.includes('norm')) {
        clearBtnGroup('.btn-norm');
        search_norm = $('#' + btn.id).html();
    }
    if (btn.id.includes('grad')) {
        clearBtnGroup('.btn-grad');
        search_grad = $('#' + btn.id).html();
    }
    if (btn.id.includes('qual')) {
        clearBtnGroup('.btn-qual');
        search_qual = $('#' + btn.id).html();
    }
    if (btn.id.includes('search')) {
        clearBtnGroup('.btn-radio-search');
        search_by = $('#' + btn.id).html();
        setGallery();
    } 
    // Set button new class
    $('#' + btn.id).removeClass('btn-outline-light');
    $('#' + btn.id).addClass('btn-light');
    $('#' + btn.id).addClass('focus');
}


function setTextInfo() {
    /** @description Manage the example buttons 
    * @param {obj} text field
    */

    // Check if text contains any info
    if ($('#txt-image-id').val() != null) {
        search_imgid = $('#txt-image-id').val();
    }
    if ($('#txt-patient-id').val() != null) {
        search_patid = $('#txt-patient-id').val();
    }
    if ($('#txt-date-acqui').val() != null) {
        search_dateacq = $('#txt-date-acqui').val();
    }
}


function clearBtnGroup(gclass) {
    /** @description Remove classes from Quality Examples Buttons
     * @param {string} gclass Button group class
     */
    $(gclass).removeClass('focus');    
    $(gclass).removeClass('btn-light');
    $(gclass).removeClass('btn-outline-light');
    $(gclass).addClass('btn-outline-light');
}


/*
 * Gallery 
 */

function setGallery() {
    /** @description Fills the gallery with the images and split by eye.
     */

    // Get gallery and reset
    var gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    // Set new items
    for (let i=0; i < imageList.length; i++){
        let el = getGalleryItem(i);
        gallery.appendChild(el);
    }

    // Fill left background
    refreshPageSize();
}


function getGalleryItem(idx) {
    /** @description Generate a button class with the appropriate classes.
      * @param {int} idx Image index
     */

    let im_data = imageList[idx];
    let txt_url = '/pilot?patient=' + im_data.patient_id + '&image=' + im_data.image_id;

    // Calculate padding top
    let ratio = im_data.height/im_data.width;
    let pad = Math.round(180 * (1 - ratio) / 2);

    // Gallery element
    var item = document.createElement('div');
    item.classList.add("gallery-item");

    // Image
    var a_link = document.createElement('a');
    a_link.href = txt_url;
    a_link.target = "_blank";
    // Image tag
    var img_html = document.createElement('img');
    img_html.src = '/gallery/' + im_data.filename;
    img_html.classList.add("img-gallery");
    img_html.setAttribute("style", "padding:" + pad + "px 0;");
    a_link.appendChild(img_html);
    item.appendChild(a_link);

    // Button Group
    var btn_group = document.createElement('div');
    btn_group.classList.add("btn-group","btn-group-sm","btn-group-show");
    btn_group.setAttribute("role", "group");
    // Ovary
    var btn_ovary = document.createElement('button');
    btn_ovary.setAttribute("id", "btn-ov-" + idx);
    btn_ovary.setAttribute("onClick", "setViewType('ovary', " + idx + ");");
    btn_ovary.innerHTML = "Ovary";
    btn_group.appendChild(btn_ovary);
    // Uterus
    var btn_uterus = document.createElement('button');
    btn_uterus.setAttribute("id", "btn-ut-" + idx);
    btn_uterus.setAttribute("onClick", "setViewType('uterus', " + idx + ");");
    btn_uterus.innerHTML = "Uterus";
    btn_group.appendChild(btn_uterus);
    // Set btn classes
    switch(im_data.us_type) {
        case "ovary":
            btn_ovary.classList.add("btn","btn-info","btn-show");
            btn_uterus.classList.add("btn","btn-outline-dark","btn-show");
          break;
        case "uterus":
            btn_ovary.classList.add("btn","btn-outline-dark","btn-show");
            btn_uterus.classList.add("btn","btn-info","btn-show");
          break;
        default:
            btn_ovary.classList.add("btn","btn-outline-dark","btn-show");
            btn_uterus.classList.add("btn","btn-outline-dark","btn-show");
    }
    // Description
    var desc = document.createElement('div');
    desc.classList.add("desc");
    desc.appendChild(btn_group);
    item.appendChild(desc);

    return item;
}

function setViewType(vtype, idx) {
    /** @description Set image ultrasound view type
      * @param {string} vtype View type
      * @param {int} idx Image index
     */
    // Get data
    let im_data = imageList[idx];
    btn_ovary = document.getElementById("btn-ov-" + idx);
    btn_uterus = document.getElementById("btn-ut-" + idx);
    // Clear btn
    btn_ovary.classList.remove("btn-info", "btn-outline-dark");
    btn_uterus.classList.remove("btn-info", "btn-outline-dark");
    // Set btn and im_data
    switch(vtype) {
        case "ovary":
            btn_ovary.classList.add("btn-info");
            btn_uterus.classList.add("btn-outline-dark");
            im_data.us_type = "ovary";
          break;
        case "uterus":
            btn_ovary.classList.add("btn-outline-dark");
            btn_uterus.classList.add("btn-info");
            im_data.us_type = "uterus";
          break;
        default:
            btn_ovary.classList.add("btn-outline-dark");
            btn_uterus.classList.add("btn-outline-dark");
            im_data.us_type = "";
    }
    // Get data
    imageList[idx] = im_data;
    /*
    * PUSH TO SERVER
    * TO INCLUDE CODE
    */
}


/* 
 * DB Search 
 */

function search() {
    /** @description Call image Quality. Evaluate displayed image.
     */

    $('.blind-screen').show();
    // Read searching criteria from text fields
    setTextInfo()
    //create object containing searching criteria        
    var search_crit= Object()
    search_crit.qual = search_qual;
    search_crit.dr = search_norm.toLowerCase();
    search_crit.grading = search_grad.toLowerCase();
    search_crit.image_id = search_imgid.toLowerCase();
    search_crit.patient_id = search_patid.toLowerCase();
    search_crit.date_acquisition = search_dateacq;
    
    // Ajax call
    $.ajax(
        {
            type: 'GET',
            url: '/gallery/search/',
            data: search_crit,
            dataType: 'json',
            cache: false,
            async: true,           
            success: function (images) {
                sortAndStoreData(images);
                setGallery();
                $('.blind-screen').hide();
            }
        });
}



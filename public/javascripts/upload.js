// Upload content
var filestoupload = [];
var filesdeleted = [];
var uploadCompleted = true; // Flag to to set whether the upload tab is active.


/*
 * Init page
 */

 function loadUploadPage(){
    /** @description Start upload application
     */
    $('footer').css('position', 'relative');
    addUploadEvents();
    updateUploadList();
    refreshPageSize();
}

function refreshPageSize() {
    /** @description Update useful field height
     */
        // Get element height
        let height_header = parseFloat($("header").css("height"));
        let height_footer = parseFloat($("footer").css("height"));
        let height_window = $(window).height();        
        let height_gallery = parseFloat($('#gallery-field').css("height"));
        // Visual field available
        let height_body = height_window - height_footer - height_header;
        
        if (height_gallery < height_body) {
            $('.bg-full-fill').css('height', height_body + 'px');
        }
        else {
            $('.bg-full-fill').css('height', height_gallery + 'px');
        }
}


/*
 * Handle Events and list of files
 */

function addUploadEvents() {
    /** @description Add Upload Events listener
     */
    // Handle on file change
    document.querySelector('#input-up-img').addEventListener('change', handleSelectedFiles, false);
}

function handleSelectedFiles(ev) {
    /** @description Handle files select to upload
     *  @param {event} e event data
     */

    if (!ev.target.files) return;

    let files = ev.target.files;
    for (let i = 0; i < files.length; i++) {
        // Update files to update list
        filestoupload.push(files[i]);
    }
    // Update table with content list
    updateUploadList();
}

function setNumberOfUpFiles() {
    /** @description Set the text of the file input. Counts the number of files chosen.
     *  @param {event} e event data
     */
    let txt = " files chosen";
    // Check the number of files to upload
    if (filestoupload.length === 0)
        txt = "No file chosen"
    else {
        if (filestoupload.length === 1)
            txt = " file chosen";
        // Add number of files
        txt = filestoupload.length + txt;
    }
    // Set input text
    $(".custom-file-label.form-control-file").text(txt);
}

function updateUploadList() {
    /** @description Repopulate the files to be upload list
     */

    var header = document.getElementById("upload-list-header");
    var body = document.getElementById("selected-files");
    body.innerHTML = "";
    header.innerHTML = "";

    if (filestoupload.length > 0) {
        header.innerHTML = "Upload list";
        for(let i = 0; i<filestoupload.length; i++){
            insertTable(i);
        }
    }
    else {
        let txt = document.createElement("h3");
        txt.setAttribute("style", "margin-top:100px;");
        txt.innerHTML = "No image selected";
        body.appendChild(txt);
    }
    // Set input text content
    setNumberOfUpFiles();
    refreshPageSize();
}

function removeFile(uid) {
    /** @description Remove file from upload list and add to deleted files.
     *   @param {int} uid Image id
     */
    let removed = filestoupload.splice(uid,1);
    filesdeleted.push(removed);
    updateUploadList();
}

/*
 * Ajax calls
 */

function submitImgForm() {
    /** @description Asynchronous submition of the form image
     */

    if (filestoupload.length > 0) {

        let forms = getInputsData();

        // Create a temp for with filestoupload
        let formData = new FormData();
        filestoupload.forEach(file => {
            formData.append('filetoupload', file);
        });
        forms.forEach(form => {
            formData.append('form', JSON.stringify(form));
        });

        // POST form
        $.ajax({
            url: "/gallery/upload",
            type: 'POST',
            data: formData,
            success: function (data) {
                var upload_list = data.file_list;
                uploadCompleted = true;
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }
    else
        return false;
}

/*
 * Load Data from form
 */

function getInputsData() {
    /** @description Get content of each input field and group in an object by image.
     */
    var forms = [];

    for(let i = 0; i<filestoupload.length; i++) {
        let tid = "tbl-img-" + i;
        let in_fname = $("#" + tid).find(".txt-fname")[0];
        let in_obs = $("#" + tid).find(".txt-obs")[0];
        let in_pat = $("#" + tid).find(".txt-patient")[0];
        let in_date = $("#" + tid).find(".txt-date")[0];
        let in_type = filestoupload[i].us_type;
        let obj = {
            filename: in_fname.value,
            observations: in_obs.value,
            patient: in_pat.value,
            date: in_date.value,
            type: in_type
        }

        forms.push(obj);
    }

    return forms;
}

/*
 * Create elements
 */

function insertTable(uid) {
    /** @description Insert table of images
     *   @param {int} uid Image id
     */

    let tbl = createTable(uid);
    let tblfield = document.getElementById("selected-files");
    tblfield.appendChild(tbl);    
}

function createTable(uid) {
    /** @description Table of content of each image
     *  @param {int} uid Image id
     */

    // handle image
    var f = filestoupload[uid];
    if (f.date === undefined)
        f.date = convertDate(f.lastModifiedDate); 
    if (f.us_type === undefined)
        f.us_type = null; 
    var im_div = createImgDiv(uid);

    // Table body
    let tbl_id = "tbl-img-" + uid;
    let stripe_class = "stripe-dark";
    if (uid % 2 === 0) {
        stripe_class = "stripe-light";
    }
    var tbl = document.createElement('table');
    tbl.setAttribute("id", tbl_id);
    tbl.classList.add("fullwidth", stripe_class);

    // Row 1
    var tr1 = document.createElement('tr');
    // col 0
    var th10 = document.createElement('th');
    th10.classList.add("force-tab-width");
    th10.setAttribute("rowspan", "4");
    th10.appendChild(im_div);
    tr1.appendChild(th10);
    // col 1
    var th11 = document.createElement('th');
    th11.classList.add("tab-header");
    th11.setAttribute("colspan", "3");
    th11.innerHTML = "Filename:";
    tr1.appendChild(th11);
    // col 2
    var th12 = document.createElement('th');
    th12.classList.add("tab-header");
    th12.setAttribute("colspan", "3");
    th12.innerHTML = "Observations:";
    tr1.appendChild(th12);

    // Row 2
    var tr2 = document.createElement('tr');
    // Inptus
    var in_fname = document.createElement('input');
    in_fname.type = "text";
    in_fname.classList.add("form-control","menu-in","txt-fname")
    in_fname.value = f.name;
    var in_obs = document.createElement('input');
    in_obs.type = "text";
    in_obs.classList.add("form-control","menu-in","txt-obs")
    //  col 1
    var td21 = document.createElement('td');
    td21.classList.add("tab-field");
    td21.setAttribute("colspan", "3");
    td21.appendChild(in_fname);
    tr2.appendChild(td21);
    //  col 2
    var td22 = document.createElement('td');
    td22.classList.add("tab-field");
    td22.setAttribute("colspan", "3");
    td22.appendChild(in_obs);
    tr2.appendChild(td22);

    // Row 3
    var tr3 = document.createElement('tr');
    // col 1
    var th31 = document.createElement('th');
    th31.classList.add("tab-header");
    th31.setAttribute("colspan", "2");
    th31.setAttribute("style", "width:10%;");
    th31.innerHTML = "Data type:";
    tr3.appendChild(th31);
    // col 2
    var th32 = document.createElement('th');
    th32.classList.add("tab-header");
    th32.setAttribute("colspan", "2");
    th32.innerHTML = "Patient ID:";
    tr3.appendChild(th32);
    // col 3
    var th33 = document.createElement('th');
    th33.classList.add("tab-header");
    th33.setAttribute("colspan", "2");
    th33.innerHTML = "Acquisition Date:";
    tr3.appendChild(th33);

    // Row 4
    var tr4 = document.createElement('tr');
    // Buttons
    radio_btn_1 = document.createElement('button');
    radio_btn_1.classList.add("btn", "btn-radio-type");
    radio_btn_1.innerHTML = "Ovary";
    if (f.us_type === "ovary")
        radio_btn_1.classList.add("selected");
    radio_btn_1.setAttribute("onClick", "setType('" + tbl_id + "', this)");
    radio_btn_2 = document.createElement('button');
    radio_btn_2.classList.add("btn", "btn-radio-type");
    radio_btn_2.innerHTML = "Uterus";
    if (f.us_type === "uterus")
        radio_btn_2.classList.add("selected");
    radio_btn_2.setAttribute("onClick", "setType('" + tbl_id + "', this)");
    radio_btn_3 = document.createElement('button');
    radio_btn_3.classList.add("btn", "btn-radio-type");
    radio_btn_3.innerHTML = "Other";
    if (f.us_type === "other")
        radio_btn_3.classList.add("selected");
    radio_btn_3.setAttribute("onClick", "setType('" + tbl_id + "', this)");
    // Inptus
    var div_btn = document.createElement('div');
    div_btn.classList.add("btn-group","btn-group-sm");
    div_btn.setAttribute("role", "group");
    div_btn.appendChild(radio_btn_1);
    div_btn.appendChild(radio_btn_2);
    div_btn.appendChild(radio_btn_3);
    var in_type = document.createElement('input');
    in_type.type = "text";
    in_type.classList.add("txt-type");
    in_type.hidden = true;
    var in_pat = document.createElement('input');
    in_pat.type = "text";
    in_pat.classList.add("form-control","menu-in","txt-patient")
    var in_date = document.createElement('input');
    in_date.type = "text";
    in_date.name ="daterange";// aria-describedby="date-annot" 
    in_date.placeholder = "MM/DD/AAAA";
    in_date.value = f.date;
    in_date.classList.add("form-control","menu-in","txt-date")
    //  col 1
    var td31 = document.createElement('td');
    td31.classList.add("tab-field");
    td31.setAttribute("colspan", "2");
    td31.appendChild(div_btn)
    td31.appendChild(in_type)
    tr4.appendChild(td31);
    //  col 2
    var td32 = document.createElement('td');
    td32.classList.add("tab-field");
    td32.setAttribute("colspan", "2");
    td32.appendChild(in_pat)
    tr4.appendChild(td32);
    //  col 3
    var td33 = document.createElement('td');
    td33.classList.add("tab-field");
    td33.setAttribute("colspan", "2");
    td33.appendChild(in_date)
    tr4.appendChild(td33);

    // Update table
    tbl.appendChild(tr1);
    tbl.appendChild(tr2);
    tbl.appendChild(tr3);
    tbl.appendChild(tr4);

    return tbl;
}

function createImgDiv(uid) {
    /** @description Create a div component with image thumb and button.
     *  @param {int} uid upload image id
     */
    // handle image
    var f = filestoupload[uid];
    var img = readURL(f);
    // Difene elements
    var div = document.createElement('div');
    var btn = document.createElement('button');
    var icon = document.createElement('i');
    // Add classes and set attributes
    div.classList.add("gallery-item");
    btn.classList.add("btn", "trash-icon");    
    btn.setAttribute("onClick", "removeFile(" + uid + ")");
    icon.classList.add("fas", "fa-trash-alt", "fa-lg");
    // Set elements order
    btn.appendChild(icon);
    div.appendChild(img);
    div.appendChild(btn);

    return div;
}

function readURL(infile) {
    /** @description Read image data and convert to image src. Retunr a image object.
     *  @param {obj} infile file object
     */
    var newImage = new Image();
    var reader = new FileReader();
    // render image
    reader.onload = function (e) {
        newImage.src = reader.result;
    }
    reader.readAsDataURL(infile);
    // return the new image
    return newImage;
}

function setType(tid, type_btn) {
    /** @description Set type of image input field.
     *  @param {string} tid table id
     *  @param {obj} type_btn button
     */
    let uid = tid.slice("tbl-img-".length);
    var f = filestoupload[uid];

    let tbl = document.getElementById(tid);
    let typefield = tbl.getElementsByClassName("txt-type")[0];
    typefield.value = type_btn.innerText.toLowerCase();
    f.us_type = type_btn.innerText.toLowerCase();

    $("#" + tid).find(".btn-radio-type").removeClass("selected");
    type_btn.classList.add("selected");
}

function convertDate(fd) {
    /** @description Convert full date time to a simple string.
     *  @param {Date} fd Full datetime
     */
    let mm = fd.getMonth();
    if (mm < 10) {
        mm = 0 + mm.toString();
    }
    let dd = fd.getDate();
    if (dd < 10) {
        dd = 0 + dd.toString();
    }
    let ss = fd.getSeconds();
    if (ss < 10) {
        ss = 0 + ss.toString();
    }
    let min = fd.getMinutes();
    if (min < 10) {
        min = 0 + min.toString();
    }    
    let hh = fd.getHours();
    if (hh < 10) {
        hh = 0 + hh.toString();
    }
    let fdate = fd.getFullYear().toString() + "/" +
            mm.toString() + "/" +
            dd.toString() + " " + 
            hh.toString() + ":" +
            min.toString() + ":" +
            ss.toString();

    return fdate;
}
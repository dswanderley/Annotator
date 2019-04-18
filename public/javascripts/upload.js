// Upload content
var filestoupload = [];
var uploadCompleted = true; // Flag to to set whether the upload tab is active.


/*
 * Init page
 */

 function loadUploadPage(){
    addUploadEvents();
}


/*
 * Handle Events
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
    // Set input text content
    setNumberOfUpFiles();
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
    // Start body
    if ($("#selected-files").find('tbody').length === 0) {
        var tbody = document.createElement("tbody");
        tbody.setAttribute("id", "upload-tbody");
    }
    else {
        var tbody = document.getElementById("upload-tbody");
        tbody.innerHTML = "";
    }

}

/*
 * Ajax calls
 */

function submitImgForm() {
    /** @description Asynchronous submition of the form image
     */

    if (filestoupload.length > 0) {
        // Create a temp for with filestoupload
        let formData = new FormData();
        filestoupload.forEach(file => {
            formData.append('filetoupload', file);
        });

        // Init loader
        $('.loader').show();

        // POST form
        $.ajax({
            url: uploadURL,
            type: 'POST',
            data: formData,
            success: function (data) {
                var upload_list = data.file_list;
                uploadCompleted = true;
                loadUpGallery();
                clearUploadList();
                // Reload after 5 seconds if the number of saved files were different from the upload files
                if (upload_list.length != data.files.length) {
                    setTimeout(loadUpGallery(), 5000);
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }
    else
        return false;
}


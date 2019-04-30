/*
*   gallery.js
*   Router responsible to manage gallery page calls
*/

// Module dependencies
var router = require('express').Router(),
    sizeOf = require('image-size');

var uploadDir = "./images/upload/"

// Gallery - GET
router.get('/gallery', function (req, res) {
    res.render('./gallery',
        { title: 'Gallery' }
    );
});


// Upload - GET
router.get('/gallery/upload', function (req, res) {
    res.render('./upload',
        { title: 'Upload Page' }
    );
});


// Upload - POST
router.post('/gallery/upload', function (req, res) {

    // Check if has file
    if (!req.files) {
        return res.send('error');
    }
    /* Handle upload */
    let files = req.files.filetoupload;
    // Prepare to foreach
    if (!Array.isArray(files)) {
        files = [files];
    }
    let forms = req.body.form;
    if (!Array.isArray(forms)) {
        forms = [forms];
    }
    // Connect to database
    db_client.connect(DB_URI, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        } else {
            console.log('MongoDB connected...');
            let dbo = client.db("annotdb");
            // Read each file and form
            for (let i = 0; i < files.length; i++) {
                let form = JSON.parse(forms[i]);
                let file = files[i];
                // New filename
                let filename = filenameGen() + '.png';
                let path = uploadDir + filename;
                // Json element
                let element = new ImageData(filename, uploadDir);
                // Save file with new name
                file.mv(path, function (err) {
                    if (err) {
                        // Print error and close connection   
                        console.log("Transfer failed");
                        console.log(err);
                        if (i == files.length)
                            db.close();                      
                    } else {
                        // Get Dimensions
                        let dim = sizeOf(path);
                        // File properties
                        element.height = dim.height;        
                        element.width = dim.width
                        element.file_type = dim.type;
                        // Form properties
                        element.originalname = form.filename;
                        element.us_type = form.us_type;
                        element.observations = form.observations;
                        element.patientId = form.patient;
                        element.date_acquisition = form.date;
                        // Date now
                        element.date_upload= new Date().toISOString();
                        // Insert data to DB
                        dbo.collection("images").insertOne(element, function(err, res) {
                            if (err) throw err;
                            console.log("document inserted!");
                            // Close connection int the end
                            if (i == files.length)
                                db.close(); 
                        });
                    }
                });
            }        
        }        
    });
});


// Return routers
module.exports = router;


/*
 * Internal functions
 */

function filenameGen() {
    /** @description Generate data from 
     */
    let date = new Date();
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var text = "";

    let ms = date.getMilliseconds() % charset.length;
    let h = date.getHours();
    let sec = date.getSeconds();
    let min = date.getMinutes();
    let day = date.getDate();
    let year = date.getFullYear() % charset.length;
    let mon = date.getMonth();

    for( var i=0; i < 5; i++ ) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    text = charset[ms] + charset[h] + charset[sec] + charset[min]
    for( var i=0; i < 6; i++ ) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    text += '_';
    text += charset.charAt(Math.floor(Math.random() * charset.length));
    text +=  charset[day] +  charset[year] +  charset[mon]
    for( var i=0; i < 6; i++ ) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    text += '_';
    for( var i=0; i < 5; i++ ) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return text;
}


class ImageData {
    /** @description Class to save image data as object.
     */
    constructor(filename, folder) {
        /** @description ImageData constructor
         *  @param {string} filename Name used to save the image file
         *  @param {string} folder Folder used to save the file
         */
        this.filename = filename;
        this.folder = folder;
        this.path = folder + filename;

        this.originalname = null;
        this.date_acquisition = null;
        this.date_upload = null;
        this.us_type = null;   // Ovary, Uterus or Other
        this.observations = null; // Text field
        this.patientId = null; // Text field
        
        this.height = null;        
        this.width = null;
        this.file_type = null;

        this.annotations = new Array();
    }
}
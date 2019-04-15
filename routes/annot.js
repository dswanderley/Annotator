/*
*   annot.js
*   Router responsible to manage annotations page calls
*/

// Module dependencies
var router = require('express').Router(),
    fs = require('fs'),
    sizeOf = require('image-size');

var galleryDir = './images/gallery/';


// Annotations - GET
router.get('/annot', function (req, res) {

    // if the login is successful
    if (req.session.user == undefined)
        res.redirect('/')
    else
        // Render page Pilot
        res.render('./annot', {
            title: 'Annotations'
    });    
});


// Gallery - GET
router.get('/annot/gallery', function (req, res) {
    // Initialize list of files
    let galleryitem = [];
    let gallery_list  = [];
    // Read json file
    let obj = JSON.parse(fs.readFileSync(galleryDir + 'data.json', 'utf8'));
    if (obj.galleryitem)
        galleryitem = obj.galleryitem.images;
    else
        galleryitem = obj.images;

    // Read directory
    fs.readdir(galleryDir, (err, files) => {
        // Load files
        files.forEach(file => {
            galleryitem.forEach(function (el) {

                if (el.filename === file) {

                    gallery_list.push(el); // add to file list
                }
            });

        });

        // Send list of files
        res.send({ gallery_list });
    });
});  


// Upload - POST
router.post('/annot', function (req, res) {
    var data = req.body;

    let annot_el = {
        uid: sess_user.uid,
        annotations: data.annotations,
        date: new Date()
    };
    let query = { filename: data.image_data.filename };

    db_client.connect(DB_URI, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('MongoDB connected...');
        let collection = client.db("annotdb").collection("images");
        collection.find(query).toArray(function (err, data) {
            // Get error
            if (err) throw err;
            // Check if user exist - returns if not.
            if (data.length > 0) {
                // Init temp list
                let annotation_list;
                // Check if exist
                if (data.annotation_list === undefined){
                    // Creat new list
                    annotation_list = [annot_el];       
                }
                else {
                    // Read current list
                    let has = false;
                    annotation_list = data.annotation_list;
                    for(let i=0; i < annotation_list.length; i++){
                        // Search element by user id
                        if (annotation_list[i].uid === annot_el.uid) {
                            has = true;
                            // Update list
                            annotation_list[i] = annot_el;
                            break;
                        }
                    }
                    if (!has) // Add new element (by user) to list
                        annotation_list.push(annot_el);
                }
                // Update query
                let update = { $set: {annotation_list: annotation_list}}             
                // Set update to database
                collection.updateOne(query, update, function(err, up) { 
                    // Get error
                    if (err) throw err;
                    res.send(up);
                });
            }
        });
    });
});

/* Classes */

class ImageData {
    constructor(filename, path) {
        this.filename = filename;
        this.path = path;
        this.width = null;
        this.height = null;
        this.patient = new PatientInfo();
        this.quality = null;
        this.dr = null;
        this.processed = false;
        this.type = null;
        this.batch = '';
        this.segmentation= new Segmentation();
    }
}
class PatientInfo {

}


// Return routers
module.exports = router;
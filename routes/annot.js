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
    // Query to find data
    let query1 = { "filename": 'hqJ4H1ZhzT_8DJdoFrP67_j98YM.png',
                   "annotations.uid": annot_el.uid 
    };
    // Query if data does not exist
    let query2 = { "filename": 'hqJ4H1ZhzT_8DJdoFrP67_j98YM.png',
                   "annotations.uid": {$ne : annot_el.uid } 
    };
    // Update data
    let newvalue1 = {
        $set : { "annotations.$" : annot_el }
    };
    // Insert data
    let newvalue2 = {
        $addToSet : { "annotations": annot_el }
    };

    db_client.connect(DB_URI, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('MongoDB connected...');
        let collection = client.db("annotdb").collection("images");
        collection.updateOne(query1, newvalue1, function (err1, res1) {
            // Get error
            if (err1) throw err1;
            console.log("Object updated: " + res1.result.nModified)

            if (res1.result.nModified < 1) {

                collection.updateOne(query2, newvalue2, function (err2, res2) { 
                    if (err2) throw err2;
                    console.log("Object inserted: " + res2.result.nModified)
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
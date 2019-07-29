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
    let gallery_list  = [];
    let query = {
        "marks": "",
        "us_type": req.query.us_type
             }

    // Connect to database
    db_client.connect(DB_URI, { useNewUrlParser: true }, function (err, client) {
        if (err)
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        else
            console.log('MongoDB connected...');

        // Get images colection
        let collection = client.db("annotdb").collection("images");

        collection.find(query).toArray(function (err, imgs) {
            // Check if user exist - returns if not.
            if (imgs.length > 0) { 

                let gallery_annot = [];
                let gallery_empty = [];
                let start_idx = 0;

                for (let i = 0; i < imgs.length; i++) {
                    let el  = imgs[i];
                    img_data = new ImageData(el, sess_user.uid);
                    if (img_data.annotations === undefined)
                        gallery_empty.push(img_data);
                    else
                        gallery_annot.push(img_data);
                    // Number of images annoted / array index
                    start_idx = gallery_annot.length;
                    gallery_list = gallery_annot.concat(gallery_empty);
                }

                // Send obj with list of files and start index
                res.send({  
                    gallery_list: gallery_list,
                    start_idx: start_idx
                });
            }
            else { 
                // Send list of files
                res.send("empty");
            }

        });

    });


    
    
});  


// Annotations - POST
router.post('/annot', function (req, res) {
    var data = req.body;
    
    let annot_el = {
        uid: sess_user.uid,
        annotations: data.annotations,
        date: new Date()
    };
    // Query to find data
    let query1 = { "image_id": data.image_id,
                   "annotations.uid": annot_el.uid 
    };
    // Query if data does not exist
    let query2 = { "image_id": data.image_id,
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
    // Connect to database
    db_client.connect(DB_URI, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('MongoDB connected...');
        // Get images colection
        let collection = client.db("annotdb").collection("images");
        // Search and update item if it exist
        collection.updateOne(query1, newvalue1, function (err1, res1) {
            // Get error
            if (err1) throw err1;
            // Check if data was modified
            if (res1.result.nModified < 1) {
                // If data does not exist insert
                collection.updateOne(query2, newvalue2, function (err2, res2) { 
                    if (err2) throw err2;
                    console.log("Object inserted: " + res2.result.nModified)
                    res.send("Annotations inserted!")
                });
            }
            else {
                console.log("Object updated: " + res1.result.nModified)
                res.send("Annotations updated!")
            }
        });
    });
});


/* Classes */

class ImageData {
    constructor(img_db, uid) {
        this.image_id = img_db.image_id;
        this.filename = img_db.filename;
        this.height = img_db.height;
        this.width = img_db.width;
        this.us_type = img_db.us_type;
        this.annotations = undefined;
        for(let i = 0; i < img_db.annotations.length; i++) {
            let ann = img_db.annotations[i];
            if(ann.uid === uid){
                this.annotations = ann.annotations;
                break;
            }
        }
    }
}



// Return routers
module.exports = router;
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

router.get('/gallery/search', function (req, res) {
    
    // Get user id
    var uid = ""
    if (sess_user !== undefined)
        uid = sess_user.uid;
    // Get all
    let query = {}

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

                let gallery_search = [];

                for (let i = 0; i < imgs.length; i++) {
                    let el  = imgs[i];
                    img_data = new ImageData(el, uid);
                    gallery_search.push(img_data);
                }
                // Send obj with list of files and start index
                res.send({  
                    gallery: gallery_search
                });
            }
            else { 
                // Send list of files
                res.send("empty");
            }
        });
    });
 });


// Upload - GET
router.get('/gallery/upload', function (req, res) {
    res.render('./upload',
        { title: 'Upload Page' }
    );
});


// Update (viewtype) - POST
router.post('/gallery/viewtype', function (req, res) {
    var data = req.body;
        
    // Query to find data
    let query = { "image_id": data.image_id };
    // Update data
    let newvalue = {
        $set : { "us_type" : data.us_type,
                 "date_update": new Date().toISOString() 
                }
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
        collection.updateOne(query, newvalue, function (err, res_in) {
            // Get error
            if (err) 
                throw err;
            else
                // Send update
                res.send("Data updated!")
        });
    });
});




// Return routers
module.exports = router;


/*
 * Internal functions
 */

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

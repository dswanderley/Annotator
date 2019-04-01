/*
*   pilot.js
*   Router responsible to manage pilot application calls
*/

// Module dependencies
var router = require('express').Router(),
    fs = require('fs'),
    sizeOf = require('image-size');

var galleryDir = './images/gallery/';

// Annotations - GET
router.get('/annot', function (req, res) {
    // Render page Pilot
    res.render('./annot', {
        title: 'Annotations'
    });
});

// Gallery - GET
router.get('/gallery', function (req, res) {
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

// Return routers
module.exports = router;
var sampleObject = {
    a: 1,
    b: 2,
    c: {
        x: 11,
        y: 22
    }
};
// Upload - POST
router.post('/annot', function (req, res) {
    var data=req.body;
    console.log(data);
    
    //var raw= JSON.parse(req.body);
    //console.log(JSON.stringify(raw,null,4));
    //fs.writeFile("./segmentation.json", JSON.stringify(class_list, null, 4), (err) => {
      //  if (err) {
      //      console.error(err);
       //     return;
        //};
        //console.log("File has been created");
    //});
    
   // return res.send({ file_list, files });
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


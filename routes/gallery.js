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

    for (let i = 0; i < files.length; i++) {
        let form = JSON.parse(forms[i]);
        let file = files[i];
        let filename = stringGen() + '.png';
        let path = uploadDir + filename;
        file.mv(path, function (err) {
            if (err) {
                // To handle
            } else {
                // Get Dimensions
                let dim = sizeOf(path);
            }
                
        });
    }
});

// Return routers
module.exports = router;


/*
 * Internal functions
 */

function stringGen() {
    
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
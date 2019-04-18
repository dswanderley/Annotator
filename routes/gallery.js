/*
*   gallery.js
*   Router responsible to manage gallery page calls
*/

// Module dependencies
var router = require('express').Router();


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
    var file_list = [];
    // Prepare to foreach
    if (!Array.isArray(files)) {
        files = [files];
    }

    // Define JSON file
    var json_path = uploadDir + 'data.json';
    // Check if data.json exist
    if (fs.existsSync(json_path)) {
        // Load JSON file with data
        var data = JSON.parse(fs.readFileSync(json_path, 'utf8'));
    }
    else {
        // Create new empty object
        var data = {
            images: new Array(),
            createTime: new Date(),
            updateTime: new Date()
        }
    }

    var batch_name = 'B01';
    if (data.images.length > 0) {
        batch_name = getNewBatchIndex(getBatchList(data.images));
    }

    // Read and save files
    for (let i = 0; i < files.length; i++)  {
        let file = files[i];
        // Filename
        let filename = file.name;
        let path = uploadDir + filename;
        // Json element
        let el = new ImageData(filename, path);
        // move to list
        file_list.push(el);
        // Move each file
        file.mv(path, function (err) {
            if (err)
                file_list.pop(); // if does not move pop from list
            else {
                // Get Dimensions
                let dim = sizeOf(path);
                el.width = dim.width;
                el.height = dim.height;
                el.type = dim.type;
                el.batch = batch_name;
                // update to json data
                data.images.push(el);
                data.updateTime = new Date();
                // Save json
                fs.writeFileSync(json_path, JSON.stringify(data, null, "\t"), (err_j) => {
                    if (err_j) throw err_j;
                });
            }
        });
    }
    
    return res.send({ file_list, files });
});


// Return routers
module.exports = router;
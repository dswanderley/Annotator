/*
*   gallery.js
*   Router responsible to manage gallery page calls
*/

// Module dependencies
var router = require('express').Router();


// Login - GET
router.get('/gallery', function (req, res) {
    res.render('./gallery',
        { title: 'Gallery' }
    );
});


// Return routers
module.exports = router;
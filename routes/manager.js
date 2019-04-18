/*
*   manager.js
*   Router responsible to admin manager page calls
*/

// Module dependencies
var router = require('express').Router();


// Manage - GET
router.get('/manage', function (req, res) {
    res.render('./manage',
        { title: 'Manage' }
    );
});



// Return routers
module.exports = router;
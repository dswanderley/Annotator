/*
*   users.js
*   Router responsible to manage index calls
*/

// Module dependencies
var router = require('express').Router();


// Index - GET
router.get('/', function (req, res) {
    res.render('./login',
        { title: 'Login Page' }
    );
});


// Return routers
module.exports = router;

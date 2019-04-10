/*
*   index.js
*   Router responsible to manage index calls
*/

// Module dependencies
var router = require('express').Router();

//var user = undefined;

// Index - GET
router.get('/', function (req, res) {
    if (sess_user != undefined ){
        sess_user = req.session.user 
    }
    res.render('./index',
        { title: 'Home', sess_user: sess_user }
    );
});


// Return routers
module.exports = router;

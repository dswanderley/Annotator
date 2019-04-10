/*
*   users.js
*   Router responsible to manage index calls
*/

// Module dependencies
var router = require('express').Router();


// Index - GET
router.get('/login', function (req, res) {
    res.render('./login',
        { title: 'Login Page' }
    );
});

router.post('/login', function (req, res) {
    // login the user and return the user object

    if (req.body.username == 'diego') {

        let local_user = {
            username: req.body.username,
            role: 'Admin',
            name: 'Diego',
            surname: 'Wanderley'
        }
        // if the login is successful
        req.session.user = local_user;
        
        sess_user = local_user;

        res.redirect('/')

    } else {
        res.render('./login',
            { title: 'Login Page' }
    );
    }
});

// Return routers
module.exports = router;

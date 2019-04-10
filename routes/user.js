/*
*   users.js
*   Router responsible to manage index calls
*/

// Module dependencies
var router = require('express').Router();


// Login - GET
router.get('/login', function (req, res) {
    res.render('./login',
        { title: 'Login Page' }
    );
});

// Login - POST
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

// Logout - POST
router.post('/logout', function (req, res) {
 
    if (req.session.user == undefined) 
        return;
    // if there is a user
    if (req.session.user.username == sess_user.username) {
        // Clear user
        req.session.user = undefined;
        sess_user = undefined;

        // Clear cookie
        //??
        req.session.destroy(err => {
            res.clearCookie('connect.sid');
            // Redirect to home
            res.redirect('/')
        });        
    }
});

// Return routers
module.exports = router;

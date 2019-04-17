/*
*   users.js
*   Router responsible to manage users pages calls
*/

// Module dependencies
var router = require('express').Router();


// Login - GET
router.get('/user/login', function (req, res) {
    res.render('./login',
        { title: 'Login Page' }
    );
});


// Login - POST
router.post('/user/login', function (req, res) {
    // login the user and return the user object

    let uname = req.body.username;
    let password = req.body.password;
    let query;
    if (validateEmail(uname)) {
        query = { email: uname };
    } else {
        query = { username: uname };
    }

    db_client.connect(DB_URI, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('MongoDB connected...');
        client.db("annotdb").collection("users").find(query).toArray(function (err, result) {
            // Get error
            if (err) throw err;
            // Enable user variable
            let user = null;
            // Check if user exist - returns if not.
            if (result.length > 0) {

                // Set user
                user = result[0];
                // Check if user password is ok - returns if not.
                if (user.password != password) {
                    res.render('./login',
                        { title: 'Login Page ERROR Pass' }
                    );
                } else {
                    // Define user object with relevant informations
                    let local_user = {
                        uid: user._id.toString(),
                        username: user.username,
                        role: user.role,
                        name: user.name,
                        surname: user.surname
                    }
                    // if the login is successful
                    req.session.user = local_user;
                    console.log("New login accepted:");
                    console.log(local_user);
                    sess_user = local_user;
                    res.redirect('/')
                }
            }
            else {
                res.render('./login',
                    { title: 'Login Page ERROR User' }
                );
            }
        });
    });
});


// Logout - POST
router.post('/user/logout', function (req, res) {

    if (req.session.user == undefined)
        return;
    // if there is a user
    if (req.session.user.username == sess_user.username) {
        // Clear user
        req.session.user = undefined;
        sess_user = undefined;

        // Clear cookie
        req.session.destroy(err => {
            res.clearCookie('connect.sid');
            // Redirect to home
            res.redirect('/')
        });
    }
});


// Login - GET
router.get('/user/profile', function (req, res) {
    res.render('./profile',
        { title: 'User\' Page' }
    );
});


// Return routers
module.exports = router;


/* Auxiliary Functions */

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
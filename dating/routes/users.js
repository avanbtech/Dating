var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');
var authentication = require('./authentication');


// Register get
router.get('/register', userController.user_register_get);

//Register post
router.post('/register', userController.user_register_post);

// Login get
router.get('/login', userController.user_login_get);

// Login post
router.post('/login', userController.user_login_post, function(req, res) {
    res.redirect('/');
});

// Logout
router.get('/logout', userController.user_logout_get);

// Profile
router.get('/profile', authentication.isLoggedIn, userController.user_profile_get);

// Update
router.post('/profile/update', authentication.isLoggedIn, userController.user_profile_update_post);

// Browse
router.get('/browse', authentication.isLoggedIn, userController.user_browse_get);

// Browse for a user
router.get('/browse/:id', authentication.isLoggedIn, userController.user_detail_get);

module.exports = router;

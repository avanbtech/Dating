var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');


// Register get
router.get('/register', userController.user_register_get);

//Register post
router.post('/register', userController.user_register_post);

// Login get
router.get('/login', userController.user_login_get);

// Login post
router.post('/login', userController.user_login_post);

// Logout
router.get('/logout', userController.user_logout_get);

// Profile
router.get('/profile', userController.user_profile_get);

module.exports = router;

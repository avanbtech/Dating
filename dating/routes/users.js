var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');
var authentication = require('./authentication');
var multer = require('multer');
// var upload = multer({dest: 'dating/public/uploads/'});
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'dating/public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + '-' + file.originalname)
    }
});
var upload = multer({storage: storage});


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

// Load form for uploading image
router.get('/profile/uploadImage', authentication.isLoggedIn, userController.user_upload_image_get);

// Update image
router.post('/profile/uploadImage', authentication.isLoggedIn, upload.single('profileImage'), userController.user_upload_image_post);

// Browse
router.get('/browse', authentication.isLoggedIn, userController.user_browse_get);

// Browse for a user
router.get('/browse/:id', authentication.isLoggedIn, userController.user_detail_get);

// Send Message
router.post('/message/add', authentication.isLoggedIn, userController.user_message_post);

// Messages
router.get('/messages', authentication.isLoggedIn, userController.user_messages);

// Display Messages
router.get('/messages/get', authentication.isLoggedIn, userController.user_messages_get);


module.exports = router;

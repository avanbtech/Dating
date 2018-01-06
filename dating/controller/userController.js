var User = require('../models/user');
var Message = require('../models/message');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');


// Handle get request for registration page
exports.user_register_get = function(req, res, next){
    res.render('register');
};

// Handle post request for user registration
exports.user_register_post = function(req, res, next){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var dateOfBirth = req.body.birthday;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var user_image = '/images/default_image.png'

    // Validation
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('birthday', 'Date of birth is required').optional({ checkFalsy: true }).isISO8601();
    req.checkBody('birthday', 'Date of birth is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{errors:errors})
    }else{
        var newUser = new User({
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            password: password,
            date_of_birth: dateOfBirth,
            image: user_image,
        });
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login');
    }
};

exports.user_login_get = function(req, res, next) {
    res.render('login');
};

// Handle post request for login
exports.user_login_post = passport.authenticate('local', {
    successRedirect:'/', failureRedirect: '/users/login',failureFlash: true
});

// Handle get request for logout
exports.user_logout_get = function(req, res, next){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
};

// Handle get request for profile
exports.user_profile_get = function(req, res, next){
    User.findById(req.user._id, function(err, result){
       if(err){throw err}
       let date = result.date_of_birth;
       let day = date.getDate();
       let month = date.getMonth() + 1;
       if(day < 10){
         day = '0' + day;
       };
       if(month < 10){
           month = '0' + month;
       }
       let updated_result = {
           first_name: result.first_name,
           last_name: result.last_name,
           email: result.email,
           date_of_birth: (date.getFullYear() + '-' + month + '-' + day),
           image: result.image
       };
        res.render('profile', {logged_in_user: updated_result});
    });
};

// Handle post request for profile update
exports.user_profile_update_post = function(req, res, next){

    req.checkBody('first_name', 'First name is required').notEmpty();
    req.checkBody('last_name', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('date_of_birth', 'Date of birth is required').optional({ checkFalsy: true }).isISO8601();
    req.checkBody('date_of_birth', 'Date of birth is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        let response = {
            error_msg: errors,
            success: false,
        };
        res.json(response);
    }
    else{
        const currentUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            date_of_birth: req.body.date_of_birth,
        };
        User.update(
            {_id: req.user._id}, currentUser,function(err, result){
                let success = {success: true};
                if(err){
                    success.success = false;
                }
                else{
                    success.success = true;
                }
                res.json(success);
        });
    }
};

// Handle get request for uploading user image
exports.user_upload_image_get = function(req, res, next){
    res.render('upload_image');
};

// Handle post request for uploading user image
exports.user_upload_image_post = function(req, res, next){
    console.log(req.file.originalname);
    console.log(req.file);

    User.update({_id: req.user._id}, {
        image: '/uploads/' + req.file.filename
    }, function (err, result) {
        if(err){throw err}
        res.redirect('/users/profile');
    })
};

// Handle get request for browse
exports.user_browse_get = function(req, res, next){
    User.find({}, function(err, users){
       if(err){throw err}
       let year = new Date().getFullYear();
       var users_with_age =[];
       for (var i=0; i< users.length; i++){
           console.log(req.user._id + ', ' + users[i]._id);
           if(req.user.username === users[i].username){
               continue;
           }
            let user_and_age = {
                user: users[i],
                age :  year - users[i].date_of_birth.getFullYear(),
            };
            users_with_age.push(user_and_age);
            console.log(user_and_age);
        }
       res.render('browse', {registered_users: users_with_age});
    });
};

// Handle get request to display user detail
exports.user_detail_get = function(req, res, next){
    User.findById({_id: req.params.id}, function(err, specific_user){
        if(err){throw err}
        let birth_day = specific_user.date_of_birth;
        let the_user = {
            user: specific_user,
            date: birth_day.getDate() + '/' + (birth_day.getMonth() + 1) + '/' + birth_day.getFullYear(),
        }
        res.render('profile_detail', {user: the_user});
    })
};

// Handle post request to sent a message to another member
exports.user_message_post = function(req, res, next){

    req.checkBody('message', 'Message cannot be empty');
    var errors = req.validationErrors();
    if(errors){
        let response = {
            error_msg: errors,
            success: false,
        };
        res.json(response);
    }
    else{
        const newMessage = new Message({
            fromUserId: req.user._id,
            toUserId: req.body.toUserId,
            message: req.body.message,
            date: req.body.date
        });
        Message.createMessage(newMessage, function(err, message){
            console.log(message);
            let response = {
                newMessage: message,
                success: true};
            if(err){
                response.success = false;
            }
            else{
                response.success = true;
            }
            res.json(response);
        })
    }
};

// Handle get request for message page
exports.user_messages = function (req, res, next){
    res.render('messages');
};

// Handle get request to see all the messages
exports.user_messages_get = function(req, res, next){
    console.log(req.user._id);
    let query = {
        $or:[{toUserId: req.user._id}, {fromUserId: req.user._id}]
    };

    Message.find(query, 'fromUserId toUserId message sent_date')
        .populate('fromUserId')
        .populate('toUserId')
        .exec(function(err, messages_to_user){
            let success = {success: true};
            if(err){
                success.success = false;
            }
            else{
                success.success = true;
            }
            let response = {
                messages: messages_to_user,
                logged_in_user: req.user.username,
                success: success
            }
            res.json(response);
    })
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


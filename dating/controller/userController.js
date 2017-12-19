var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
            date_of_birth: dateOfBirth
        });
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login');
    }
};

// Handle get request for login page
exports.user_login_get = function(req, res, next){
    res.render('login');
};

// Handle post request for login
exports.user_login_post = function(req, res, next){
    passport.authenticate('local', {successRedirect:'/', failureRedirect: '/users/login',failureFlash: true }),
        function(req, res) {
            res.redirect('/');
        }
};

//Handle get request for logout
exports.user_logout_get = function(req, res, next){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
};

// Handle get request for profile
exports.user_profile_get = function(req, res, next){
    res.render('profile');
};


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


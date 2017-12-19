var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Register
router.get('/register', function(req, res, next) {
  res.render('register');
});

// Login
router.get('/login', function(req, res){
  res.render('login');
});

// Register User
router.post('/register', function(req, res, next) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var dateOfBirth = req.body.birthday;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    console.log(req.body);

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
});

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

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

router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect: '/users/login',failureFalash: true }),
    function(req, res) {
    res.redirect('/');
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/' + req.user.username);
    });

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;

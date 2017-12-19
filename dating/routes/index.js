var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  res.render('index');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg', 'You need to login to access this page');
        res.redirect('/users/login');
    }
}

module.exports = router;
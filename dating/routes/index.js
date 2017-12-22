var express = require('express');
var router = express.Router();
var authentication = require('./authentication');

/* GET home page. */
router.get('/', authentication.isLoggedIn , function(req, res, next) {
  res.render('index');
});

module.exports = router;


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg', 'You need to login to access this page');
        res.redirect('/users/login');
    }
}

module.exports = {
    isLoggedIn: ensureAuthenticated,
};
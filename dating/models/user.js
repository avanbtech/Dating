var mongoose = require('mpngoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/dating_db');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    username:{type: String, index: true},
    password:{type: String},
    email:{type: String},
    name: {type: String}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.getSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
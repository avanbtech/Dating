var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = mongoose.Schema({
    fromUserId: {type: Schema.ObjectId, ref: 'User'},
    toUserId: {type: Schema.ObjectId, ref: 'User'},
    message: {type: String},
    sent_date: {type: Date}
});

var Message = module.exports = mongoose.model('Message', MessageSchema);

module.exports.createMessage = function(newMessage, callback){
    newMessage.save(callback);
};

module.exports.findMessagesByUserId = function(userId, callback){
    Message.findById(id, callback);
};
var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
    fromUserId: {type: Schema.ObjectId, ref: 'users'},
    toUserId: {type: Schema.ObjectId, ref: 'users'},
    message: {type: String},
    sent_date: {type: Date}
});

var Message = module.exports = mongoose.model('Message', MessageSchema);
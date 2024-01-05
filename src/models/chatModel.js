const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    user: String,
    message: String,
    server: Number,
    dateSent: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat
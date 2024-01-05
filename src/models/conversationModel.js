const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    server: String,
    pair: Array,
    chat: Array,
    status: Number
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation
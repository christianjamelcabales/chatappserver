const mongoose = require('mongoose');
const { Schema } = mongoose;

const serverSchema = new Schema({
    server: Number,
    isAvailable: Number
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server
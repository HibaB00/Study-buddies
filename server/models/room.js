const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    roomImageType: {
        type: String
        
    },
    admin: String,
    type: String,
    messages:[{
        message: String,
        author: String,
        time: String
    }],
    time: String
})


module.exports = mongoose.model('room', roomSchema);
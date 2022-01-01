const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    title: {
        type: String
    },
    roomImageType: {
        type: String
        
    },
    admin: String,
    type: String
})


module.exports = mongoose.model('room', roomSchema);
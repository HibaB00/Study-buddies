const Rooms = require('./room.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer
    },
    imageType: {
        type: String
        
    },
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'room'
    }]
})

module.exports = mongoose.model('user', userSchema);
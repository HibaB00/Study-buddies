const express = require('express');
const router = express.Router();
const Rooms = require('../models/room.js');
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const ImgMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


router.get('/getPublicRooms', async (req, res) =>{
    try{
        const publicRooms = await Rooms.find({type: 'public'})
        res.json({publicRooms: publicRooms})
    }catch (error){
        res.status(404).json({message: error.message})
    }
})

router.get('/:roomId', async (req, res) =>{
    try{
        const roomInfo = await Rooms.findOne({_id: req.params.roomId})
        res.json({room: roomInfo})
    }catch (error){
        res.status(404).json({message: error.message})
    }
})

router.post('/deleteRoom', async (req, res) => {
    try{
        const deleteRoom = await Rooms.deleteOne({_id: req.body.roomId});
        const user = await User.findOne({username: req.body.admin});
        let filter = user.rooms.filer(function(value){
                return value != req.body.roomId
        })
        user.rooms.push(filter)
        user.save();
        
    }catch (error){
        res.status(404).json({message: error.message})
    }
})

router.post('/getRoomInfo', async (req, res) => {
    try{
        const roomInfo = await Rooms.findOne({_id: req.body.roomId})
        res.json({oldmessages: roomInfo.messages})
    }catch (error){
        res.status(404).json({message: error.message})
    }
})



router.post('/getRooms', async(req, res) => {
    try{
        const postRooms = await req.body.username
        const rooms = await Rooms.find({admin: postRooms})
        res.json({rooms: rooms})
    }catch (error){
        res.status(404).json({message: error.message})
    }
})

router.post('/checkUser', async(req, res) =>{
    try{
        const token = await req.header('Token')
        let decode = jwtDecode(token)
        if(token){
            const user = await User.findOne({
                email: decode.email
            })
            if(user){
                res.json({user: user})
            }else{
                res.json({status: 'error', user: ""})
            }
        }else{
            res.json({status: 'error', message: 'no valide user', user: ""})
        }
    }catch (error){
        res.status(404).json({message: error.message})
    }
})

router.post('/register', async (req, res) => {
    let image = req.files.file;
    const {name, size, mimetype, data} = image;
    
    try {
        const user = await User.create({
            username: req.body.usernameReg,
            email: req.body.userEmailReg,
            password: req.body.userPasswordReg,
            image: new Buffer.from(data, 'base64'),
            imageType: mimetype,
            rooms:[]
        })
        // saveAvatar(user, req.body.file)
        const token = jwt.sign({
            name: user.username,
            email:user.email,
            rooms: user.rooms
        }, 'secret123')
        res.json({status: 'ok', user: token});
    } catch (error) {
        res.json({status: 'error', error:'email or username already exists'})
    }
})

router.post('/registerRoom', async(req, res) =>{
    const postRoom = req.body;
    try{
        const room = await Rooms.create({
            title: postRoom.title,
            roomImageType: postRoom.imageRoom,
            admin: postRoom.admin,
            type: postRoom.type
        })
        const user = await User.findOne({
            username: postRoom.admin
        })
        user.rooms.push(room)
        await user.save();
        res.json({status:'added room', user: user})
    }catch (error){
        res.status(409).json({message: error.message})
    }
})

function saveAvatar(user, image){
    if(image == null) return
    const avatar = JSON.parse(avatarEncoded)
    if(cover != null && ImgMimeTypes.includes(avatar.type)){
        user.selectedFile = new Buffer.from(avatar.data, 'base64')
        user.selectedFileType = avatar.type
    }
}

router.post('/login', async (req, res) => {
    const user = await User.findOne({
            email: req.body.email, 
            password: req.body.password
    })
    if(user){
        const token = jwt.sign({
            name: user.username,
            email:user.email,
            selectedFile: user.selectedFile,
            rooms: user.rooms
        }, 'secret123')

        return res.json({status: 'ok', user: token})
    }else{
        res.json({status: 'error', user: false})
    }
})

router.post('/token', async(req,res) => {
    const token = req.body.token;
    let decoded = jwt_decode(token);
    res.json(token)
})


module.exports = router;
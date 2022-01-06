const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Room = require('./models/room.js')
const cors = require('cors');
const postRoutes = require('./routes/posts.js');
const fileUpload = require('express-fileupload');
const http = require("http");
// const { Server } = require("socket.io");
let corsOptions = { cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};

app.use(cors());
app.use(express.json({limit: '5mb'}));
app.use(fileUpload());
app.use('/posts', postRoutes)

app.use(bodyParser.urlencoded({extended: true}))


const server = http.createServer(app);

const io = require('socket.io')(server, corsOptions)

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
    socket.on("send_message", async (data) => {
        const room = {
          author: data.author,
          message: data.message,
          time: data.time
        }
        const mainRoom = await Room.findOne({_id: data.room})
        mainRoom.messages.push(room)
        await mainRoom.save();
        socket.to(data.room).emit("receive_message", data);
    });
    socket.on("send_link", async (data) =>{
        socket.to(data.room).emit("receive_link", data.link)
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
    socket.on("send_timer", async(data) => {
        socket.to(data.roomId).emit("receive_time", data)
    })
});
  
 

const CONNECTION_URL = 'mongodb+srv://studybuddywebsite:abdelkarim1@studybuddy.6eaqy.mongodb.net/StudyBuddy'
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => server.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
.catch((error) => console.log(error.message))





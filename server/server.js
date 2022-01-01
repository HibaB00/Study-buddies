const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/posts.js');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());
app.use(express.json({limit: '5mb'}));
app.use(fileUpload());

app.use('/posts', postRoutes)

app.use(bodyParser.urlencoded({extended: true}))

const CONNECTION_URL = 'mongodb+srv://studybuddywebsite:abdelkarim1@studybuddy.6eaqy.mongodb.net/StudyBuddy'
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
.catch((error) => console.log(error.message))


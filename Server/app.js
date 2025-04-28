const express = require('express');
require('dotenv').config();
const connection = require('./config/DB')
const router = require('./routes/auth')
const userdetails = require('./routes/userDeatils')
const createPost = require('./routes/createPost')
const userposts = require('./routes/userPosts');
const path = require('path')
const comment = require("./routes/comment")
const axios = require('axios');



const app= express();
const port = process.env.PORT||4000;
connection();
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/api/auth',router)
app.use('/api',userdetails)
app.use('/api',createPost)
app.use('/api',userposts)
app.use('/api',comment)
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/',(req,res)=>{
   
res.send("hey! server is running ")
})
  
setInterval(() => {
  axios.get('https://your-post-backend.onrender.com') // Replace with your endpoint
    .then(() => console.log('Server kept alive'))
    .catch((err) => console.error('Error keeping server alive:', err));
}, 300000); // Ping every 5 minutes

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})


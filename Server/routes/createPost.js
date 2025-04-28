const express = require('express')
const router = express.Router();
const upload = require('../models/multer');
const post = require('../models/post')
const user = require('../models/userSchema')
const verifyToken = require("../middileware/verifyToken")
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const cloudinary = require('cloudinary').v2;
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
//route to create new user post
router.post('/upload',upload.single("postImage"),verifyToken, async (req,res)=>{
    try {
        const {postCaption} = req.body;
        const result = sentiment.analyze(postCaption);

       
        const loginuser = await user.findById(req.user.userid);
        const imageUrl = req.file.path;
       console.log("image is uploaded successfully", imageUrl);
       
        const newpost = new post({
            userId:loginuser._id,
            postImage:imageUrl,
            postCaption:postCaption,
            public_id:req.file.filename,
            comments:{
                text:postCaption,
                user:loginuser.username,
            },
            sentimentScore:result.score,
        })
        
        
        await newpost.save();
        loginuser.posts.push(newpost._id);
        await loginuser.save();
       
        
       return res.json({success:true})


    } catch (error) {

        console.log("err:",error)
        res.json({success:false})
    }
})
//route to edit profile picture
router.post("/editpicture",upload.single('profileImage'),verifyToken,async(req,res)=>{
    try {
        
        const loginuser = await user.findById(req.user.userid);
        if(!loginuser){
            return res.json({success:false})
        }
        const imageUrl = req.file.path;
        console.log(imageUrl);
        
        loginuser.profile_picture = imageUrl;
        await loginuser.save();
        res.json({user:loginuser,success:true})
    } catch (error) {
        console.log("error",error)
    }
})
//routes for fetch all posts that eixts in database post model
router.get("/allposts", async (req,res)=>{
    try {
        const allpost = await post.find().sort( { sentimentScore: -1 }).populate("userId");
        res.json({success:true,posts:allpost})
    } catch (error) {
        console.log(error);
        res.json({success:false,error});
    }

})
router.post("/deletePost",verifyToken,async(req,res)=>{
    try {
        const {id} = req.body;
        if (!id) {
            return ;
        }
        const postToDelete = await post.findById(id);
        if (!postToDelete) {
            return res.json({success:false,message:"Post is not found"})
        }
        const result = await cloudinary.uploader.destroy(postToDelete.public_id);
        if (result.result === "ok") {
           console.log("Image deleted successfully");
          
        } else {
            res.status(404).json({ message: "Image not found" });
        }
         
       

        const updateduser = await user.findByIdAndUpdate(
            req.user.userid,
            { $pull: { posts: id } },
            { new: true }
          ).populate('posts');

         
        
    const updatedpost =  await post.findByIdAndDelete(id);
   
      
      

     return res.json({updateduser,success:true});

    } catch (error) {
        console.log(error);
       return  res.json({success:false});
    }
})
module.exports = router;
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/userSchema")
const verifyToken = require('../middileware/verifyToken')
const Sentiment = require('sentiment');
const sentiment = new Sentiment();


router.post("/post/comment/:id",verifyToken,async(req,res)=>{
    const { id } = req.params;
    const { text } = req.body;
  
    

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const user = await User.findById(req.user.userid);
        if(!user) return res.status(404).json({ message: "user not found" });

        const username =  user.username;

        post.comments.push({user:username, text });
        await post.save();
        res.status(200).json({success:true,post});
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }

})
router.get("/post/comment/:id",async(req,res)=>{
    const {id} = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        
        
        res.status(200).json({success:true,post});
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }

})
router.post("/post/sentiment-analysis",async(req,res)=>{
    try {
        const { comment, postId } = req.body;
        const result = sentiment.analyze(comment);
        const post = await Post.findById(postId);
        if(!post){
            return res.status(500).json({success:false,message:"Post is not found"});
        }
        const sentimentScore = result.score;
       
        const updateSentimentScore = post.sentimentScore+sentimentScore;
       
        post.sentimentScore = updateSentimentScore;
        await post.save();
        console.log(post.sentimentScore);
        
        res.status(201).json({success:true,post});
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:error})
    }
   
    

})
module.exports = router;
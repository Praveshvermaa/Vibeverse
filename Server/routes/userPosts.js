const express = require('express')
const router = express.Router();
const user = require('../models/userSchema')
const verifyToken = require("../middileware/verifyToken")
const mongoose = require('mongoose');
const { route } = require('./comment');
const User = require('../models/userSchema');
const ObjectId = mongoose.Types.ObjectId;
//routes for fetch all posts those are uploaded by user
router.get('/userposts',verifyToken,async (req,res)=>{
  try {
   
    const getuser = await user
    .findById(req.user.userid)
    .populate("posts");
    
    if(getuser){
      return  res.json({getuser,success:true})

    }
  } catch (error) {
    console.log(error)
    res.json({success:false})
  }
})
//route to store current user'id to the user whose profile is being viewed by current user
router.post('/profileveiwer',verifyToken,async(req,res)=>{
  try {
    const {profileOwnerId} = req.body;
    const profileOwner = await user.findById(profileOwnerId);
    if(!profileOwner){
      return res.json({success:false,message:"profile owner is not found"});
    }
    const isPresent = profileOwner.profile_viewer.some((id) => id.toString() === req.user.userid);
    if(!isPresent){
      profileOwner.profile_viewer.push(req.user.userid);
      await profileOwner.save();
    }
    
    res.json({success:true})
  } catch (error) {
    console.log(error);
    
  }
 

})
router.get('/dashboard/usersposts',verifyToken,async(req,res)=>{
  try {
    const user = await User.findById(req.user.userid).populate("posts");
    if(!user) return res.status(404).json({message:"user is not found"});
    res.status(201).json({success:true,user});
  } catch (error) {
    console.log(error); 
  }
})
module.exports = router;
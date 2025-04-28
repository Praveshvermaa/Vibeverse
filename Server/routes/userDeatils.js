const express = require('express')
const userSchema =require('../models/userSchema')
const verifyToken = require('../middileware/verifyToken')



const router = express.Router();
//routes to fetch  logged in user details
router.get('/userdetails',verifyToken,async(req,res)=>{
    try {
        const user = await userSchema.findById(req.user.userid).populate('posts');
    if(!user){
        return res.json({success:false})
    }
    res.json({user,success:true})
    } catch (error) {
        console.log(error);
        return res.json({error})
    }
   
    

})
//routes to fetch profile owner details
router.post('/profileownerdetails',async(req,res)=>{
    try {
        const {profileOwnerId} = req.body
        const profileOwner = await userSchema.findById(profileOwnerId).populate('posts');
        if (!profileOwner) {
            return res.json({success:false,message:'user is not found'})
            
        }
        res.json({success:true,profileOwner});
    } catch (error) {
        console.log(error);
        
    }
})
router.get('/profileviewer',verifyToken,async(req,res)=>{
    try {
       
        
        const currentUser = await userSchema.findById(req.user.userid).populate('profile_viewer');
        if (!currentUser) {
            return res.json({success:false,message:"user is not found"})
        }
        
        

        res.json({success:true,currentUser});
    } catch (error) {
        
    }
})
module.exports = router;
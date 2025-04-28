const express = require('express')
const router = express.Router();
const userSchema = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


router.post('/register',async(req,res)=>{
    try {
        const {username,name,email,password} = req.body;
        const salt = await bcrypt.genSalt(10);
        if(!password){
            return res.json({message:"Password is not found"})
        }
        
        const hashPassword = await bcrypt.hash(password,salt);
        let user = await userSchema.findOne({email});
        if(user){
            return res.json({success:false,message:"User already exists"});
        }
        user =  await userSchema.create({username,name,email,hashPassword});
        
        res.json({user,success:true,message:"registration successful"});
    } catch (error) {
        console.log(error)
    }
   
})
router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    if(!email||!password) return res.json({success:false,message:"Email or password are not found!"});
    try {
        const user = await userSchema.findOne({email});
        if(!user){
            return res.json({success:false,message:"User do not exists!"})
        }
      
        if(!password&&!user.hashPassword){
            return res.json({success:false,meassage:"Password is required!!"})
        }
    
        const isMatchPassword =  bcrypt.compare(password,user.hashPassword);
        const payload = {userid: user._id,email:user.email};
        const token =  jwt.sign(payload,process.env.SECRET_KEY);
    
    
        if(isMatchPassword){
           
            res.json({token,user,success:true});
    
        }
    } catch (error) {
        console.log(error)

    }

    
   
    
})
module.exports=router


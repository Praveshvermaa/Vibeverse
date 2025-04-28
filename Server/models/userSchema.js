const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        require:true,
    },
    name:{
        type:String,
        require:true,

    },
    email:{
        type:String,
        require:true,
        unique:true,

    },
    hashPassword:{
        type:String,
        require:true,
    },
    profile_picture:{
        type:String
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ],
    profile_viewer:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]

})
const User = mongoose.model('user',userSchema)
module.exports=User
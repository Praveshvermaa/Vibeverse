const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: { type: String, required: true }, 
    text: { type: String, required: true }, 
    date: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    postImage:{
        type:'String',
    },
    postCaption:{
        type:'String'
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    },
   public_id:{
    type:'String',
   },
   comments: [commentSchema],
   sentimentScore:{
    type:Number,
    default:0
   }
})
const post = mongoose.model("post",postSchema)
module.exports = post;
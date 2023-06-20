const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    nickname:{
        type:String,
        required:true
    },
    content:{
        type:String
    }
},{versionKey:false,timestamps:{createdAt:true,updatedAt:true}});

const comment = mongoose.model('Comment',commentSchema);

module.exports = comment;
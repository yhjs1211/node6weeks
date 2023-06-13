const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    author:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    content:{
        type:String
    }
},{versionKey:false});

const comment = mongoose.model('Comment',commentSchema);

module.exports = comment;
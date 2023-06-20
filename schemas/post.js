const mongoose = require('mongoose');

const post = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    nickname:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    content:{
        type:String
    },
    createdAt:{
        type:String
    }
},{versionKey:false});

module.exports = mongoose.model('Post',post);
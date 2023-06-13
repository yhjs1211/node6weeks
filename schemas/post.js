const mongoose = require('mongoose');

const post = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
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
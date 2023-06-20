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
    content:{
        type:String
    }
},{versionKey:false, timestamps:{createdAt:true,updatedAt:true}});

// post.virtual('readOnlyData')
//     .get(function(){
//         const obj={
//             title:this.title,
//             content:this.content,
//             createdAt:this.createdAt,
//             updatedAt:this.updatedAt
//         };
//         return JSON.parse(JSON.stringify(obj));
//     });

module.exports = mongoose.model('Post',post);
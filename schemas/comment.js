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
    comment:{
        type:String
    }
},{versionKey:false,timestamps:{createdAt:true,updatedAt:true}});

commentSchema.virtual('readOnlyData')
    .get(function(){
        const obj={
            commentId:this._id,
            userId:this.userId,
            nickname:this.nickname,
            comment:this.comment,
            createdAt:this.createdAt,
            updatedAt:this.updatedAt
        }
        return JSON.parse(JSON.stringify(obj));
    })

const comment = mongoose.model('Comment',commentSchema);
    
module.exports = comment;
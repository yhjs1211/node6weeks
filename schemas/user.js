const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    nickname:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type : String,
        required : true
    }
},{versionKey:false, toJSON:{virtuals:false}});

// DB상에 등록되지 않으나 가상의 필드를 생성
user.virtual('readOnlyData')
    .get(function(){
        return `id : ${this._id}, Name : ${this.name}, Nickname : ${this.nickname}`
    });

module.exports = mongoose.model('user',user);
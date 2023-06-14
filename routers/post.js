const express = require('express');
const router = express.Router();

// DB Schema 연결
const Post = require('../schemas/post.js');


// ObjectId 유효성 검사 변수
const mongoose = require('mongoose');
const obj = mongoose.Types.ObjectId;

// 전체 목록 조회
router.get('/',async (req,res)=>{
    const datas = await Post.find();
    res.json({
        data:datas
    });
});

// 단일 게시글 조회
router.get('/:_postId',async (req,res)=>{
    const postId = req.params._postId;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const data = await Post.findById(postId).catch(console.error);
        if(!data){
            res.status(404).json({"message":"존재하지 않는 게시물 입니다."});
        }else{
            res.json({
                Success:true,
                data:data
            });
        } 
    };
});

// 게시글 작성
router.post('/',async (req,res)=>{
    const {title,author,password,content} = req.body;
    const createdAt = new Date().toLocaleString();
    const data = await Post.create({
        title,
        author,
        password,
        content,
        createdAt
    });

    res.status(201);
    res.end();
});

// 게시글 수정
router.put('/:_postId',async (req,res)=>{
    const postId = req.params._postId;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const data = await Post.findById(postId);

        if(!data){
            res.status(404).json({"message":"게시글이 존재하지 않습니다."});
        }else{
            await Post.updateOne(data,{$set: req.body});
            res.status(200).json({
                Success:true,
                "message":"게시글을 수정하였습니다."
            });
        }
    };
});

// 게시글 삭제
router.delete('/:_postId',async (req,res)=>{
    const postId = req.params._postId;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const data = await Post.findById(postId);

        if(!data){
            res.status(404).json({"message":"게시글이 존재하지 않습니다."});
        }else{
            await Post.deleteOne(data);
            res.json({
                Success:true,
                "message":"게시글을 삭제하였습니다."
            });
        }
    };
});

module.exports = router;
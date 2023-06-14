const express = require('express');
const router = express.Router();

// 스키마 import
const Comment = require('../schemas/comment.js');
const Post = require('../schemas/post.js');

// ObjectId 유효성 검사 변수
const mongoose = require('mongoose');
const obj = mongoose.Types.ObjectId;

// 해당 게시물 전체 댓글 목록 조회
router.get('/',async (req,res)=>{
    const postId = req.query.post_id;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const post = await Post.findById(postId).catch(console.error);
        const comments = await Comment.find({post_id:postId}).catch(console.error);

        if(!post){
            res.status(400).json({"message":"게시글이 존재하지않습니다."});
        }else{
            if(comments.length==0){
                res.json({"message":"댓글이 없습니다."});
            }else{
                res.status(200).json({"comments":comments});
            }
        }
    };
});

// 댓글 작성
router.post('/',async (req,res)=>{
    const postId = req.query.post_id;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const post = await Post.findById(postId).catch(console.error);
        if(!post)res.status(400).json({"message":"게시글이 존재하지않습니다."});

        const {author,password,content} = req.body;

        await Comment.create({
            author:author,
            password:password,
            post_id:postId,
            content:content
        }).catch(console.error);

        res.status(201);
        res.end();
    };
});

// 댓글 수정
router.put('/',async (req,res)=>{
    const commentId = req.query.comment_id;
    if(!obj.isValid(commentId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const data = await Comment.findById(commentId).catch(console.error);
        if(!data){
            res.status(400).json({
                success:false,
                "message":"존재하지 않는 댓글입니다."
            });
        }else{
            await Comment.updateOne(data,{$set:req.body});
            res.status(200).json({
                success:true,
                "message" : "Update Complete!"
            });
        }
    };
});

// 댓글 삭제
router.delete('/',async (req,res)=>{
    const commentId = req.query.comment_id;
    if(!obj.isValid(commentId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const data = await Comment.findById(commentId).catch(console.error);
        if(!data){
            res.status(400).json({
                success:false,
                "message":"존재하지 않는 댓글입니다."
            });
        }else{
            await Comment.deleteOne(data);
            res.status(204);
            res.end();
        }
    };
});

module.exports=router;
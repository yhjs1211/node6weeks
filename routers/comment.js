const express = require('express');
const router = express.Router();

// JWT key
const key = require('../key.js');

// 스키마 import
const Comment = require('../schemas/comment.js');
const Post = require('../schemas/post.js');

// ObjectId 유효성 검사 변수
const mongoose = require('mongoose');
const obj = mongoose.Types.ObjectId;

// Cookie parser
const cookie = require('cookie-parser');
router.use(cookie());

router.route('/')
// 해당 게시물 전체 댓글 목록 조회
.get(async (req,res)=>{
    const postId = req.query.post_id;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        let post=null;
        let comments=null;
        try {
            post = await Post.findById(postId);
            comments = await Comment.find({post_id:postId}).sort("-createdAt");
        } catch (e) {
            console.error('Server Error ! =>'+e);
        }
        if(!post){
            res.status(400).json({"message":"게시글이 존재하지않습니다."});
        }else{
            if(c.length==0){
                res.json({"message":"댓글이 없습니다."});
            }else{
                res.status(200).json({"comments":c});
            }
        }
    };
})
// 댓글 작성
.post(async (req,res)=>{
    const postId = req.query.post_id;
    
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const post = await Post.findById(postId).catch(console.error);
        if(!post)res.status(400).json({"message":"게시글이 존재하지않습니다."});

        const {author,password,content} = req.body;
        if(content.length==0){
            res.status(400).json({
                Success:false,
                "message":"댓글 내용을 입력해주세요."
            });
        }else if(author.length==0){
            res.status(400).json({
                Success:false,
                "message":"작성자 이름을 입력해주세요."
            });
        }else if(password.length==0){
            res.status(400).json({
                Success:false,
                "message":"비밀번호를 입력해주세요."
            });
        }else{
            await Comment.create({
                author:author,
                password:password,
                post_id:postId,
                content:content
            }).catch(console.error);
    
            res.status(201);
            res.end();
        };
    };
})
// 댓글 수정
.put(async (req,res)=>{
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
            const con = req.body.content;
            const pw = req.body.password;
            if(data.password==pw){
                if(con.length!=0){
                    await Comment.updateOne(data,{$set:req.body});
                    res.status(200).json({
                        success:true,
                        "message" : "Update Complete!"
                    });
                }else{
                    res.status(400).json({
                        success:false,
                        "message":"댓글 내용을 입력해주세요."
                    });
                }
            }else{
                res.status(401).json({
                    Success:false,
                    "message":"비밀번호를 확인해주세요."
                });
            }
        }
    };
})
// 댓글 삭제
.delete(async (req,res)=>{
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
            const pw = req.body.password;
            if(data.password==pw){
                await Comment.deleteOne(data);
                res.status(204);
                res.end();
            }else{
                res.status(401).json({
                    Success:false,
                    "message":"비밀번호를 확인해주세요."
                });
            };
        };
    };
});

module.exports=router;
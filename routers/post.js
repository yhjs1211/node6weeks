const express = require('express');
const router = express.Router();

// DB Schema 연결
const Post = require('../schemas/post.js');
const Comment = require('../schemas/comment.js');

// Auth Middleware
const isAuth = require('../middleware/auth.js');

// ObjectId 유효성 검사 변수
const mongoose = require('mongoose');
const obj = mongoose.Types.ObjectId;

router.route('/')
// 전체 목록 조회
.get(async (req,res)=>{
    let datas=null; 
    try {
        datas = (await Post.find().sort({"createdAt":-1})).map(v=>v.readOnlyData);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success:false,
            "message":"Server Error"
        });
    }
    res.json({
        data:datas
    });
})
// 게시글 작성
.post(isAuth,async (req, res, next) => {
    const {id,nickname} = res.locals.user;
    const {title, content} = req.body;
    if(title.length!=0 && content.length!=0){
        await Post.create({
            userId:id,
            nickname,
            title,
            content
        }).catch(console.error);

        res.status(201).json({
            message:"게시글 작성에 성공하였습니다."
        });
        res.end();
    }else{
        res.status(412).json({
            success:false,
            errorMessage:"제목과 내용을 확인해주세요."
        });
    }
});


router.route('/:_postId')
// 단일 게시글 조회
.get(async (req,res)=>{
    const postId = req.params._postId;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        let data=null;
        try {
            data = await Post.findById(postId);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                "errorMessage": "게시글 조회에 실패하였습니다."
            })
        }
        if(data){
            res.json({
                Success:true,
                data:data.readOnlyData
            });
        }else{
            res.status(404).json({"message":"존재하지 않는 게시물 입니다."});
        } 
    };
})
// 게시글 수정
.put(isAuth,async (req,res)=>{
    const postId = req.params._postId;
    const {id,nickname} = res.locals.user;
    const {title, content} = req.body;

    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        try {
            const data = await Post.findById(postId);
            if(!data){
                res.status(404).json({"message":"게시글이 존재하지 않습니다."});
            }else{
                if(data.nickname===nickname && data.userId.toHexString()===id){
                    if(title.length!=0 && content.length!=0){
                        await Post.updateOne(data,{$set: req.body});
                        res.status(200).json({
                            Success:true,
                            "message":"게시글을 수정하였습니다."
                        });
                    }else{
                        res.status(412).json({
                            Success:false,
                            "message":"데이터 형식이 올바르지 않습니다."
                        });    
                    }
                }else{
                    res.status(403).json({
                        Success:false,
                        "message":"게시글 수정 권한이 없습니다."
                    });
                }
            }           
        } catch (e) {
            console.error(e);
            res.status(500).json({
                "errorMessage": "게시글 수정에 실패하였습니다."
            })
        }
    };
})
// 게시글 삭제
.delete(isAuth,async (req,res)=>{
    const postId = req.params._postId;
    const {id,nickname} = res.locals.user;
    const {title, content} = req.body;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        try {
            const data = await Post.findById(postId);
            if(!data){
                res.status(404).json({"message":"게시글이 존재하지 않습니다."});
            }else{
                if(data.nickname===nickname && data.userId.toHexString()===id){
                    await Post.deleteOne(data)
                        .then(Comment.deleteMany(postId));
                    res.status(200).json({
                        Success:true,
                        "message":"게시글을 삭제하였습니다."
                    });
                }else{
                    res.status(403).json({
                        Success:false,
                        "message":"게시글 삭제 권한이 없습니다."
                    });
                }
            }           
        } catch (e) {
            console.error(e);
            res.status(500).json({
                "errorMessage": "게시글 삭제에 실패하였습니다."
            })
        }
    }
});

module.exports = router;
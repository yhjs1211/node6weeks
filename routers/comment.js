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
const jwt = require('jsonwebtoken');
router.use(cookie());

router.route('/')
// 해당 게시물 전체 댓글 목록 조회
.get(async (req,res)=>{
    const postId = req.query['post-id'];
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        let post=null;
        let comments=null;
        try {
            post = await Post.findById(postId);
            comments = await Comment.find({postId}).sort("-createdAt");
        } catch (e) {
            console.error('Server Error ! =>'+e);
            res.status(500).json({
                Success:false,
                "message":"Server Error"
            });
        }
        if(!post){
            res.status(400).json({"message":"게시글이 존재하지않습니다."});
        }else{
            if(comments.length===0){
                res.json({"message":"댓글이 없습니다."});
            }else{
                res.status(200).json({"comments":comments});
            }
        }
    };
})
// 댓글 작성
.post(async (req,res)=>{
    const postId = req.query['post-id'];
    
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const post = await Post.findById(postId).catch(console.error);
        if(!post)res.status(400).json({"message":"게시글이 존재하지않습니다."});

        const accessToken = req.cookies['access-token'];
        if(accessToken){
            try {
                const payload = await jwt.verify(accessToken, key);
                const {nickname, id} = payload;
                const content = req.body.content;
                if(!content || content.length===0){
                    res.status(403).json({
                        Success:false,
                        "errorMessage":"데이터 형식이 올바르지 않습니다."
                    });
                };
                const contentReg = /^[\w\sㄱ-ㅎ가-힣\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{5,}$/;
                if(contentReg.test(content)){
                    await Comment.create({
                        postId,
                        userId:id,
                        nickname,
                        content
                    }).catch(console.error);
            
                    res.status(201);
                    res.end();
                }else{
                    res.status(400).json({
                        Success:false,
                        "message":"최소 5자 이상 댓글을 입력해주세요."
                    })
                };
            } catch (e) {
                console.error(e);
                res.status(403).json({
                    Success:false,
                    "errorMessage":"전달된 쿠키에서 오류가 발생하였습니다."
                });
            }
                
        }else{
            res.status(403).json({
                Success:false,
                "errorMessage":"로그인이 필요한 기능입니다."
            });
        };
    };
})
// 댓글 수정
.put(async (req,res)=>{
    const commentId = req.query['comment-id'];
    if(!obj.isValid(commentId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const accessToken = req.cookies['access-token'];
        if(accessToken){
            try {
                const payload = await jwt.verify(accessToken,key);
                const nickname = payload.nickname;
                const comment = await Comment.findById(commentId).catch(console.error);
                if(!comment){
                    res.status(404).json({
                        Success:false,
                        "errorMessage":"댓글이 존재하지 않습니다."
                    });
                }else{
                    if(comment.nickname===nickname){
                        const content = req.body.content;
                        const contentReg = /^[\w\sㄱ-ㅎ가-힣\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{5,}$/;
                        if(contentReg.test(content)){
                            try {
                                await Comment.updateOne(comment,{content:content});    
                            } catch (e) {
                                console.error(e);
                                res.status(400).json({
                                    Success:false,
                                    "errormessage":"댓글 수정이 정상적으로 처리되지 않았습니다."
                                });
                            }
                            res.status(200).json({
                                Success:true,
                                "message":"댓글을 수정하였습니다."
                            });
                        }else{
                            res.status(412).json({
                                Success:false,
                                "errorMessage":"데이터 형식이 올바르지 않습니다."
                            });    
                        }
                    }else{
                        res.status(403).json({
                            Success:false,
                            "errorMessage":"댓글의 수정 권한이 존재하지 않습니다."
                        });
                    }
                }
                
            } catch (e) {
                console.error(e);
                res.status(403).json({
                    Success:false,
                    "errorMessage":"전달된 쿠키에서 오류가 발생하였습니다."
                });
            }
        }else{
            res.status(403).json({
                Success:false,
                "errorMessage":"로그인이 필요한 기능입니다."
            });
        }
    };
})
// 댓글 삭제
.delete(async (req,res)=>{
    const commentId = req.query['comment-id'];
    if(!obj.isValid(commentId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const accessToken = req.cookies['access-token'];
        if(accessToken){
            try {
                const payload = await jwt.verify(accessToken,key);
                const nickname = payload.nickname;
                try {
                    const comment = await Comment.findById(commentId);
                    if(comment.nickname===nickname){
                        try {
                            await Comment.deleteOne(comment).catch(console.error);    

                            res.status(200).json({
                                Success:true,
                                "message":"댓글을 삭제하였습니다."
                            });
                        } catch (e) {
                            res.status(400).json({
                                Success:false,
                                "errorMessage":"댓글 삭제가 정상적으로 처리되지 않았습니다."
                            })
                        };
                    }else{
                        res.status(403).json({
                            Success:false,
                            "errorMessage":"댓글 삭제 권한이 존재하지 않습니다."
                        })
                    };
                } catch (e) {
                    console.error(e);
                    res.status(404).json({
                        Success:false,
                        "errorMessage":"댓글이 존재하지 않습니다."
                    });    
                };
            } catch (e) {
                console.error(e);
                res.status(403).json({
                    Success:false,
                    "errorMessage":"전달된 쿠키에서 오류가 발생하였습니다."
                });
            }
        }else{
            res.status(403).json({
                Success:false,
                "errorMessage":"로그인이 필요한 기능입니다."
            });
        }
    };
});

module.exports=router;
const express = require('express');
const router = express.Router();

// 스키마 import
const Comment = require('../schemas/comment.js');
const Post = require('../schemas/post.js');

// ObjectId 유효성 검사 변수
const mongoose = require('mongoose');
const obj = mongoose.Types.ObjectId;

// auth middleware
const isAuth = require('../middleware/auth.js');

router.route('/')
// 해당 게시물 전체 댓글 목록 조회
.get(async (req,res)=>{
    const postId = req.query.id;

    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        let post=null;
        let comments=null;
        try {
            post = await Post.findById(postId);
            comments = (await Comment.find({postId}).sort("-createdAt")).map(v=>v.readOnlyData);
            if(!post){
                // Post가 존재하지않는데 불필요한 데이터 comments 삭제
                if(comments)await Comment.deleteMany(postId);
                res.status(400).json({"message":"게시글이 존재하지않습니다."});
            }else{
                if(comments.length===0){
                    res.json({"message":"댓글이 없습니다."});
                }else{
                    res.status(200).json({"comments":comments});
                }
            }
        }catch (e) {
            console.error('Server Error ! =>'+e);
            res.status(500).json({
                Success:false,
                "message":"Server Error"
            });
        }
    };
})
// 댓글 작성
.post(isAuth,async (req,res)=>{
    const postId = req.query.id;
    const {id,nickname} = res.locals.user;

    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        try {
            const post = await Post.findById(postId).catch(console.error);
            if(post){
                const comment = req.body.comment;
                if(!comment || comment.length===0){
                    res.status(403).json({
                        Success:false,
                        "errorMessage":"데이터 형식이 올바르지 않습니다."
                    });
                };
                const commentReg = /^[\w\sㄱ-ㅎ가-힣\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{5,}$/;
                if(commentReg.test(comment)){
                    await Comment.create({
                        postId,
                        userId:id,
                        nickname,
                        comment
                    });
            
                    res.status(201).json({
                        Success:true,
                        message:"댓글을 작성하였습니다."
                    });
                }else{
                    res.status(400).json({
                        Success:false,
                        "message":"최소 5자 이상 댓글을 입력해주세요."
                    })
                };   
            }else{
                res.status(400).json({"message":"게시글이 존재하지않습니다."});
            }
        } catch (e) {
            console.error(e);
            res.status(403).json({
                Success:false,
                "errorMessage":"댓글 작성에 실패하였습니다."
            });
        }
    };
})
// 댓글 수정
.put(isAuth,async (req,res)=>{
    const commentId = req.query.id;
    const {id,nickname} = res.locals.user;

    if(!obj.isValid(commentId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
        });
    }else{
        try {
            const foundComment = await Comment.findById(commentId);
            if(!foundComment){
                res.status(404).json({
                    Success:false,
                    "errorMessage":"댓글이 존재하지 않습니다."
                });
            }else{
                if(foundComment.nickname===nickname && foundComment.userId.toHexString()===id){
                    const comment = req.body.comment;
                    const contentReg = /^[\w\sㄱ-ㅎ가-힣\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{5,}$/;

                    if(contentReg.test(comment)){
                            await Comment.updateOne(foundComment,{comment:comment});    
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
            res.status(400).json({
                Success:false,
                "errormessage":"댓글 수정이 정상적으로 처리되지 않았습니다."
            });
        }
    };
})
// 댓글 삭제
.delete(isAuth,async (req,res)=>{
    const commentId = req.query.id;
    const {id,nickname} = res.locals.user;

    if(!obj.isValid(commentId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        try {
            const comment = await Comment.findById(commentId);
            if(comment){
                if(comment.nickname===nickname && comment.userId.toHexString()===id){
                    await Comment.deleteOne(comment);

                    res.status(200).json({
                        Success:true,
                        "message":"댓글을 삭제하였습니다."
                    });
                }else{
                    res.status(403).json({
                        Success:false,
                        "errorMessage":"댓글 삭제 권한이 존재하지 않습니다."
                    })
                };
            }else{
                res.status(404).json({
                    Success:false,
                    "errorMessage":"댓글이 존재하지 않습니다."
                })
            };
        } catch (e) {
            console.error(e);
            res.status(404).json({
                Success:false,
                "errorMessage":"댓글 삭제가 정상적으로 처리되지 않았습니다."
            });    
        };
    };
});

module.exports=router;
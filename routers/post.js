const express = require('express');
const router = express.Router();

// DB Schema 연결
const Post = require('../schemas/post.js');
const Comment = require('../schemas/comment.js');

// JWT && key
const jwt = require('jsonwebtoken');
const key = require('../key.js');

// ObjectId 유효성 검사 변수
const mongoose = require('mongoose');
const obj = mongoose.Types.ObjectId;

// Cookie parser
const cookie = require('cookie-parser');
router.use(cookie());

router.route('/')
// 전체 목록 조회
.get(async (req,res)=>{
    let datas=null; 
    try {
        datas = await Post.find().sort({"createdAt":-1}).populate('userId','_id name');
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success:false,
            "message":"Server Error"
        })
    }
    res.json({
        data:datas
    });
})
// 게시글 작성
.post(async (req,res)=>{
    const accessToken = req.cookies['access-token'];
    if(accessToken){
        if(jwt.verify(accessToken,key)){
            const {title,content} = req.body;
            const {id,nickname} = jwt.decode(accessToken);
            if(title.length!=0 && id.length!=0 && nickname.length!=0){
                try {
                    const data = await Post.create({
                        userId:id,
                        nickname,
                        title,
                        content
                    });
                    res.status(201);
                    res.end();
                } catch (e) {
                    console.error(e);
                    res.status(500).json({
                        "errorMessage": "게시글 작성에 실패하였습니다."
                    })
                }
            }else{
                res.status(412).json({
                    "errorMessage": "데이터 형식이 올바르지 않습니다."
                })
            }
        }else{
            res.status(403).json({
                "errorMessage": "전달된 쿠키에서 오류가 발생하였습니다."
            });
        }
    }else{
        res.status(403).json({
            "errorMessage": "로그인이 필요한 기능입니다."
        });
    };
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
                data:data
            });
        }else{
            res.status(404).json({"message":"존재하지 않는 게시물 입니다."});
        } 
    };
})
// 게시글 수정
.put(async (req,res)=>{
    const postId = req.params._postId;
    
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const accessToken = req.cookies['access-token'];
        if(accessToken){
            if(jwt.verify(accessToken,key)){
                const nickname = jwt.decode(accessToken).nickname;
                try {
                    const data = await Post.findById(postId);
                    if(!data){
                        res.status(404).json({"message":"게시글이 존재하지 않습니다."});
                    }else{
                        if(data.nickname===nickname){
                                await Post.updateOne(data,{$set: req.body});
                                res.status(200).json({
                                    Success:true,
                                    "message":"게시글을 수정하였습니다."
                                });
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
            }else{
                res.status(403).json({
                    "errorMessage": "전달된 쿠키에서 오류가 발생하였습니다."
                });
            }
        }else{
            res.status(403).json({
                "errorMessage": "로그인이 필요한 기능입니다."
            });
        }
    };
})
// 게시글 삭제
.delete(async (req,res)=>{
    const postId = req.params._postId;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        let data = null;
        try {
            data=await Post.findById(postId);    
        } catch (e) {
            console.error(e);
            res.status(500).json({
                "errorMessage": "게시글 삭제에 실패하였습니다."
            })
        }
        if(!data){
            res.status(404).json({"message":"게시글이 존재하지 않습니다."});
        }else{
            const accessToken=req.cookies['access-token'];
            if(accessToken){
                if(jwt.verify(accessToken,key)){
                    const nickname = jwt.decode(accessToken).nickname;
                    if(data.nickname===nickname){
                        try {
                            await Post.deleteOne(data);
                            await Comment.deleteMany({postId:postId});    
                        } catch (e) {
                            console.error(e);
                            res.status(500).json({
                                "errorMessage": "게시글 삭제에 실패하였습니다."
                            })
                        }
                        res.json({
                            Success:true,
                            "message":"게시글을 삭제하였습니다."
                        });
                    }else{
                        res.status(403).json({
                            Success:false,
                            "message":"게시글 삭제 권한이 없습니다."
                        });
                    }
                }else{
                    res.status(403).json({
                        "errorMessage": "전달된 쿠키에서 오류가 발생하였습니다."
                    });
                }
            }else{
                res.status(403).json({
                    "errorMessage": "로그인이 필요한 기능입니다."
                });
            }
        }
    }
});

module.exports = router;
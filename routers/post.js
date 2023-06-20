const express = require('express');
const router = express.Router();

// DB Schema 연결
const Post = require('../schemas/post.js');

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
        datas = await Post.find().sort({"createdAt":-1});   
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
            const {title,author,password,content} = req.body;
            if(title.length!=0 && author.length!=0 && password.legnth!=0){
                const createdAt = new Date().toLocaleString();
                try {
                    const data = await Post.create({
                        title,
                        author,
                        password,
                        content,
                        createdAt
                    });
    
                    res.status(201).json({
                        "message": "게시글 작성에 성공하였습니다."
                    });   
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
})
// 게시글 수정
.put(async (req,res)=>{
    const postId = req.params._postId;
    if(!obj.isValid(postId)){
        res.status(400).json({
            Success:false,
            "message":"잘못된 ID값 입니다."
    })}else{
        const data = await Post.findById(postId);
        const pw = req.body.password;
        if(!data){
            res.status(404).json({"message":"게시글이 존재하지 않습니다."});
        }else{
            if(data.password==pw){
                await Post.updateOne(data,{$set: req.body});
                res.status(200).json({
                    Success:true,
                    "message":"게시글을 수정하였습니다."
                });
            }else{
                res.status(401).json({
                    Success:false,
                    "message":"비밀번호를 확인해주세요."
                });
            }
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
        const data = await Post.findById(postId);
        const pw = req.body.password;
        if(!data){
            res.status(404).json({"message":"게시글이 존재하지 않습니다."});
        }else{
            if(data.password==pw){
                await Post.deleteOne(data);
                res.json({
                    Success:true,
                    "message":"게시글을 삭제하였습니다."
                });
            }else{
                res.status(401).json({
                    Success:false,
                    "message":"비밀번호를 확인해주세요."
                });
            }
        }
    };
});

module.exports = router;
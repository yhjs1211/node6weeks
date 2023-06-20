const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../schemas/user.js');
const key = require('../key.js');

router.post('/signup',async (req, res, next) => {
    const {name,nickname,password,confirm} = req.body;
    
    // 1. 입력 유효값 확인
    if(name.length!=0 && nickname.length!=0 && password.length!=0 && confirm.length!=0){
        // 2. password === confirm ? pass : throw error    
        if(password===confirm){
            let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/; // 문자,숫자,특수기호 조합으로 8-15
            if(reg.test(password)){
                try {
                    const data = await User.find({nickname:nickname});
                    if(data.length==0){
                        const created = await User.create({
                            name,
                            nickname,
                            password
                        });

                        res.status(201).json({
                            "message":"회원가입 되셨습니다.",
                            "data":created.readOnlyData
                        });
                        res.end();
                    }else{
                        res.status(412).json({
                            "errorMessage": "중복된 닉네임입니다."
                        });
                    }
                } catch (e) {
                    console.log("Error => "+e);
                    res.status(400).json({
                        "errorMessage": "중복된 닉네임입니다."
                    });
                }
            }else{
                res.status(412).json({
                    "errorMessage":"문자와 숫자, 특수기호를 최소 1개씩 포함한 8~15자리 비밀번호를 입력해주세요."
                });
            }
        }else{
            res.status(412).json({
                "errorMessage":"비밀번호와 확인 비밀번호의 값이 다릅니다. 다시 시도해주세요."
            });
        }
    }else{
        res.status(400).json({
            "errorMessage": "입력을 확인해주세요."
        });
    }
    

})

router.post('/login',async (req, res, next) => {
    const {nickname, password} = req.body;
    try {
        const data = await User.find({nickname:nickname, password:password});
        
        if(data.length!=0){
            // Token
            const token = await jwt.sign({
                id:data[0]._id.toHexString(),
                nickname:nickname,
                password:password
                }, key,{expiresIn:'1h'});
            res.cookie('access-token',token,{httpOnly:true});
            res.status(200).end();
        }else{
            res.status(412).json({
                "errorMessage": "닉네임 또는 패스워드를 확인해주세요."
            });
        }    
    } catch (error) {
        res.status(400).json({
            "errorMessage": "로그인에 실패하였습니다."
        });
        console.log(error);
    }
})

module.exports = router;
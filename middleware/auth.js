const jwt = require('jsonwebtoken');
const User = require('../schemas/user.js');
const config = require('../config.js');

const isAuth = async (req, res, next) => {
    
    const authorization = req.cookies.Authorization;
    if(authorization){
        const token = authorization.split(' ')[1];

        let payload;
        try {
            payload = await jwt.verify(token,config.jwt.secret);    
        } catch (e) {
            res.status(403).json({
                Success:false,
                errorMessage:"전달된 쿠키에서 오류가 발생하였습니다."
            });
            console.error(e);
        }

        const userId = payload.id;
        const foundUser = await User.findById(userId);

        if(foundUser){
            res.locals.user = foundUser.readOnlyData;
            next();
        }else{
            res.status(403).json({
                errorMessage: "존재하지 않는 회원입니다."
            });
        }
        
    }else{
        res.status(400).json({
            errorMessage: "로그인이 필요한 기능입니다."
        });
    }

    
}

module.exports=isAuth;
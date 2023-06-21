// Router 연결
const router = require('./routers/index.js');

// DB import
const dbConnect = require('./mongodb.js');
dbConnect();

// Server
const express = require('express');
const config = require('./config.js');
const cookie = require('cookie-parser');
const app = express();

// req Data json 변환
app.use(express.json());
app.use(cookie());

//메인 페이지 URL 안내
app.get('/',(_,res)=>{
    res.status(200).json({
        1:"GET /posts",
        2:"POST /posts",
        3:"PUT /posts:_postId",
        4:"DELETE /posts:_postId",
        5:"GET /comments?id=postId",
        6:"POST /comments?id=postId",
        7:"PUT /comments?id=commentId",
        8:"DELETE /comments?id=commentId",
        9:"POST /singup",
        10:"POST /login",
        11:"GET /logout"
    });
    res.end();
})

app.use('/',router);


app.listen(config.host.port,()=>{
    console.log(`8081 is running...`);
})



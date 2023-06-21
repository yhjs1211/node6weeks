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
        3:"PUT /posts:post_id",
        4:"DELETE /posts:post_id",
        5:"GET /comments?post_id=:postId",
        6:"POST /comments?post_id=:postId",
        7:"PUT /comments?comment_id=:commentId",
        8:"DELETE /comments?comment_id=:commentId",
        9:"POST /singup",
        10:"POST /login"
    });
    res.end();
})

app.use('/',router);


app.listen(config.host.port,()=>{
    console.log(`8081 is running...`);
})



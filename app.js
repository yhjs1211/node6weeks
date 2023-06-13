// Router 연결
const postRouter = require('./routers/post.js');
const commentRouter = require('./routers/comment.js');

// Server
const express = require('express');
const app = express();

// req Data json 변환
app.use(express.json());

//메인 페이지 URL 안내
app.get('/',(_,res)=>{
    res.send('1. posts , 2. comments/postid');
    res.end();
})

app.use('/posts',postRouter);
app.use('/comments',commentRouter);

app.listen(8081,()=>{
    console.log(`8081 is running...`);
})



const express = require('express');
const postRouter = require('./post.js');
const commentRouter = require('./comment.js');
const userRouter = require('./user.js');

const router = express.Router();

const defaultRouter = [
    {
        path:'/posts',
        route: postRouter
    },
    {
        path:'/comments',
        route: commentRouter
    },
    {
        path:'/',
        route: userRouter
    }
];
// 바로 연결 되는것이 아닌 중간에 forEach 문을 한번 돌게되는것이기 때문에 코드상으로는 깔끔하지 모르나 비효율적일것 같다. 한번쯤 이런 방법도 있다는걸 인지도 하기위해 사용.
defaultRouter.forEach(r=>{
    router.use(r.path, r.route);
})

module.exports = router;
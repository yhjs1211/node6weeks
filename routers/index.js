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

defaultRouter.forEach(r=>{
    router.use(r.path, r.route);
})

module.exports = router;
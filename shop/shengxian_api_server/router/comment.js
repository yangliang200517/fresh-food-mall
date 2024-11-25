const express = require('express')
const router = express.Router()
const commentFunc = require('../router_function/comment')

// 获取用户评论中的好评
router.post('/comment/commentgood', commentFunc.getCommentGoodStart)

// 获取用户评论中的中评
router.post('/comment/commentmiddle', commentFunc.getCommentMiddleStart)

// 获取用户评论中的差评
router.post('/comment/commentbad', commentFunc.getCommentBadStart)

module.exports = router
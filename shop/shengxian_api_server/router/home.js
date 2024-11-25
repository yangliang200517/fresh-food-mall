const express = require('express')
const router = express.Router()
const userFunc = require('../router_function/home')

// 获取商品
router.get('/goods', userFunc.getGoods)

// 获取商品详情页数据
router.get('/goods/detail', userFunc.getGoodsDetail)

// 获取商品详情页评论数据
router.get('/goods/detail/comment', userFunc.getGoodsDetailComment)

module.exports = router
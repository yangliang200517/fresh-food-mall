const express = require('express')
const dataFunc = require('../router_function/data')
const router = express.Router()

// 获取指定分下的每个商品评价数据
router.post('/data/get', dataFunc.getData)

// 获取指定分类评价占比
router.post('/data/get/reviews', dataFunc.getCateReviewsData)

// 获取指定分类下的所有商品的库存量
router.post('/data/get/stock', dataFunc.getCateProductData)

module.exports = router
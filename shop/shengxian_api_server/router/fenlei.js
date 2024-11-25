const express = require('express')
const router = express.Router()
const fenleiFunc = require('../router_function/fenlei')

// 删除购物车商品
router.get('/fenlei/getfenlei', fenleiFunc.getFenleiData)

module.exports = router
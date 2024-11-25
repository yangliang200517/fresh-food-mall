const express = require('express')
const consumerFunc = require('../router_function/consumer')
const router = express.Router()


// 获取轮播图
router.get('/consumer', consumerFunc.getConsumer)


module.exports = router
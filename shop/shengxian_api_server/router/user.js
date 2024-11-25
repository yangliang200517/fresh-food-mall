const express = require('express')
const userFunc = require('../router_function/user')
const expressJoi = require('@escook/express-joi')
const { user_data_schema } = require('../yanzheng/user')
const router = express.Router()

// 注册
router.post('/reguser', expressJoi(user_data_schema), userFunc.regUser)
// 登录
router.post('/login', expressJoi(user_data_schema), userFunc.login)

module.exports = router
const express = require('express')
const forgetFunc = require('../router_function/forgetpwd')
const expressJoi = require('@escook/express-joi')
const { update_forgetpwd } = require('../yanzheng/user')
const router = express.Router()
// 忘记密码
router.post('/forget/password', expressJoi(update_forgetpwd), forgetFunc.forGetPassword)

module.exports = router
const express = require('express')
const userFunc = require('../router_function/userinfo')
const expressJoi = require('@escook/express-joi')
const multer = require('multer')
const path = require('path')
const { update_userinfo, update_password } = require('../yanzheng/user')
const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images'); // 使用相对路径
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now(); // 获取当前时间戳
    const randomString = Math.random().toString(36).substring(2, 8); // 生成随机字符串
    const extension = path.extname(file.originalname); // 获取原始文件的扩展名
    cb(null, `${timestamp}-${randomString}${extension}`); // 结合时间戳、随机字符串和原始文件扩展名生成文件名
  }
})

const upload = multer({ storage: storage })

router.get('/userinfo', userFunc.getuserInfo)

// 修改信息
router.post('/userinfo', expressJoi(update_userinfo) ,userFunc.updateUserInfo)

// 修改密码
router.post('/updatepassword', expressJoi(update_password) ,userFunc.updateUserPassword)

// 修改头像
router.post('/update/avater', upload.single('user_pic') ,userFunc.updateAvater)

module.exports = router
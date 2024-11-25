const express = require('express')
const memberFunc = require('../router_function/member')
const expressJoi = require('@escook/express-joi')
const { insert_admin } = require('../yanzheng/user')
const router = express.Router()


// 获取管理员信息
router.get('/member', memberFunc.getMember)

// 获取管理员信息
router.post('/member/grade', memberFunc.setMemberGrade)

// 删除管理员
router.post('/member/del', memberFunc.delMember)

// 添加管理员
router.post('/member/add', expressJoi(insert_admin),  memberFunc.addMember)


module.exports = router
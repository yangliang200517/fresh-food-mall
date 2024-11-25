const express = require('express')
const router = express.Router()
const addressFunc = require('../router_function/address')

// 获取用户信息
router.post('/addressuser', addressFunc.selUserInfo)

// 获取地址
router.post('/address', addressFunc.getAddress)

// 新增地址
router.post('/newaddress', addressFunc.insNewAddress)

// 修改地址
router.post('/updateaddress', addressFunc.setAddress)

// 删除地址
router.post('/deleteaddress', addressFunc.delAddress)

// 设置默认地址
router.post('/defaultaddress', addressFunc.setIsDefaultAddress)

module.exports = router
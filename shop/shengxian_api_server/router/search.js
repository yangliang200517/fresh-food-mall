const express = require('express')
const router = express.Router()
const searchFunc = require('../router_function/search')

// 获取搜索商品
router.post('/search', searchFunc.getSearchItem)
// 获取以价格升序排序的搜索商品
router.post('/searchasc', searchFunc.getSearchItemAsc)
// 获取以价格降序排序的搜索商品
router.post('/searchdesc', searchFunc.getSearchItemDesc)


module.exports = router
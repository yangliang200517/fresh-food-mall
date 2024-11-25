const express = require('express')
const router = express.Router()
const cartFunc = require('../router_function/cart')

// 添加商品到购物车
router.post('/cart/addgoods', cartFunc.addCartGoods)

// 获取购物车商品列表
router.post('/cart/cartlist', cartFunc.getCartList)

// 更新购物车商品列表
router.post('/cart/updatecart', cartFunc.updateCartList)

// 删除购物车商品
router.post('/cart/deletecart', cartFunc.deleteCartList)

module.exports = router
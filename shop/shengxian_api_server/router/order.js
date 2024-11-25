const express = require('express')
const router = express.Router()
const ordersFunc = require('../router_function/order')

// 获取订单商品
router.post('/orders', ordersFunc.getOrders)

// 添加购买后的订单商品
router.post('/orders/pay', ordersFunc.addPayOrders)

// 获取购买后的所有订单商品
router.post('/orderitem', ordersFunc.getOrderItem)

// 获取购买后指定状态的订单商品
router.post('/orderitemOne', ordersFunc.getOrderTypeOne)

// 删除订单商品
router.post('/deleteorderitem', ordersFunc.deleteOrderItem)

// 取消订单
router.post('/cancelorderitem', ordersFunc.cancelOrderItem)

// 查询已完成但没有评价的订单或以评价的订单
router.post('/commentorder', ordersFunc.getcommOrderItem)

// 提交订单评价
router.post('/setordercomm', ordersFunc.setCommOrderItem)

// 追加订单评价
router.post('/setcomm', ordersFunc.setCommItem)

// 查询售后订单
router.post('/service', ordersFunc.getOrderOverItem)

// 修改售后状态
router.post('/setservice', ordersFunc.setOrderItemType)


module.exports = router
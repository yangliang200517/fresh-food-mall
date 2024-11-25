import request from '@/utils/request'

// 获取订单商品
export const getOrder = (type, obj) => {
  return request.post('/api/orders', {
    type,
    ...obj
  })
}

// 添加购买后的订单商品
export const addPayOrder = (type, obj) => {
  return request.post('/api/orders/pay', {
    type,
    ...obj
  })
}

// 获取购买后的所有订单商品
export const getPayOrder = (userId, currentPage, pageSize) => {
  return request.post('/api/orderitem', {
    userId,
    currentPage,
    pageSize
  })
}

// 获取购买后的订单商品
export const getPayOrderOne = (userId, orderType, currentPage, pageSize) => {
  return request.post('/api/orderitemOne', {
    userId,
    orderType,
    currentPage,
    pageSize
  })
}

// 删除订单商品
export const deleteOrderItem = (userId, orderId, productId) => {
  return request.post('/api/deleteorderitem', {
    userId,
    orderId,
    productId
  })
}

// 取消订单商品
export const cancelOrderItem = (productStatus, userId, orderId, productId) => {
  return request.post('/api/cancelorderitem', {
    productStatus,
    userId,
    orderId,
    productId
  })
}

// 查询已完成但没有评价的订单
export const getCommOrderItem = (userId, productStatus, isComment) => {
  return request.post('/api/commentorder', {
    userId,
    productStatus,
    isComment
  })
}

// 提交订单评价
export const setOrderComm = (orderId, userId, productId, rating, comment) => {
  return request.post('/api/setordercomm', {
    orderId,
    userId,
    productId,
    rating,
    comment
  })
}

// 追加订单评价
export const setComms = (orderId, userId, productId, rating, comment) => {
  return request.post('/api/setcomm', {
    orderId,
    userId,
    productId,
    rating,
    comment
  })
}

// 获取售后指定订单
export const getServiceOrderItem = (userId, productStatus, isType) => {
  return request.post('/api/service', {
    userId,
    productStatus,
    isType
  })
}

// 修改售后状态
export const setOrderItemType = (orderId, userId, productId) => {
  return request.post('/api/setservice', {
    orderId,
    userId,
    productId
  })
}

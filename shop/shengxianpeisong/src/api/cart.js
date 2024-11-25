import request from '@/utils/request'

// 添加购物车
export const setCartGoods = (userId, productId, quantity) => {
  return request.post('/api/cart/addgoods', {
    userId,
    productId,
    quantity
  })
}

// 获取购物车列表
export const getCartList = (userId) => {
  return request.post('/api/cart/cartlist', {
    userId
  })
}

// 更新购物车列表
export const getNewCartList = (cartId, productId, quantity) => {
  return request.post('/api/cart/updatecart', {
    cartId,
    productId,
    quantity
  })
}

// 删除购物车列表
export const setDeleteCartList = (cartId) => {
  return request.post('/api/cart/deletecart', {
    cartId
  })
}

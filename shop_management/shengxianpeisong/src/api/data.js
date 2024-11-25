import request from '@/utils/request'

// 获取指定分下的每个商品评价数据
export const getData = (data) => {
  return request.post('/api/data/get', {
    ...data
  })
}

// 获取指定分类评价占比
export const getReviews = (category_id) => {
  return request.post('/api/data/get/reviews', {
    category_id
  })
}

// 获取指定分类下的所有商品的库存量
export const getProductStock = (category_id) => {
  return request.post('/api/data/get/stock', {
    category_id
  })
}

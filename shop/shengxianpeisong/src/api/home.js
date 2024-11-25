import request from '@/utils/request'

// 获取首页数据
export const getHomeGoods = () => {
  return request.get('/api/goods')
}

// 获取商品详情页数据
export const getGoodsDetail = (productId) => {
  return request.get('/api/goods/detail', {
    params: {
      productId
    }
  })
}

// 获取商品详情评论数据
export const getGoodsDetailComment = (productId) => {
  return request.get('/api/goods/detail/comment', {
    params: {
      productId
    }
  })
}

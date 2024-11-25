import request from '@/utils/request'

// 获取商品
export const getGoods = () => {
  return request.get('/api/goods')
}

// 获取商品详情图片
export const getGoodsDetail = (product_id) => {
  return request.post('/api/goods/getdetail', {
    product_id
  })
}

// 修改/添加详情图片
export const setAndAddGoodsDetail = (formDatas) => {
  return request.post(
    '/api/goods/pics',
    formDatas, // 直接将 FormData 对象发送
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

// 删除商品详情图片
export const delGoodsDetail = (detail_id) => {
  return request.post('/api/goods/deldetail', {
    detail_id
  })
}

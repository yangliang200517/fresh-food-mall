import request from '@/utils/request'

// 获取商品
export const getGoods = (pageData) => {
  return request.post('/api/goods', {
    ...pageData
  })
}

// 修改或添加商品
export const setGoods = (pageData, formData) => {
  return request.post(
    '/api/goods/add',
    {
      ...pageData,
      formData
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

// 删除商品
export const delGoods = (product_id) => {
  return request.post('/api/goods/delete', {
    product_id
  })
}

// 获取商品评价数据
export const getProductRviews = (product_id) => {
  return request.post('/api/goods/getviews', {
    product_id
  })
}

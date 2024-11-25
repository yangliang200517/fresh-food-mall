import request from '@/utils/request'

// 获取轮播图
export const getCarousel = () => {
  return request.get('/api/carousel')
}

// 添加或修改轮播图
export const setCarousel = (data, imgData) => {
  return request.post(
    '/api/carousel/add',
    {
      ...data,
      imgData
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

// 删除轮播图
export const deleteCarousel = (id) => {
  return request.post('/api/carousel/delete', {
    id
  })
}

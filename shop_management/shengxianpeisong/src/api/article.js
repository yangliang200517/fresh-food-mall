import request from '@/utils/request'

// 获取分类
export const getArticle = () => {
  return request.get('/api/article')
}

// 添加分类
export const addArticle = (data) => {
  return request.post('/api/addArticle', {
    ...data
  })
}

// 修改分类
export const setArticle = (data) => {
  return request.post('/api/setArticle', {
    ...data
  })
}

// 删除分类
export const delArticle = (category_id) => {
  return request.post('/api/delArticle', {
    category_id
  })
}

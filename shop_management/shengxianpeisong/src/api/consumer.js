import request from '@/utils/request'

// 获取分类
export const getConsumer = () => {
  return request.get('/api/consumer')
}

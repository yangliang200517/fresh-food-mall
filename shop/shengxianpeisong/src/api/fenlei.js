import request from '@/utils/request'

// 获取分类数据
export const getFenleiData = () => {
  return request.get('/api/fenlei/getfenlei')
}

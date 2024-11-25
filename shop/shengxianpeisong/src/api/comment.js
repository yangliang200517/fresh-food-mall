import request from '@/utils/request'

// 获取好评数据
export const getCommitGood = (productId) => {
  return request.post('/api/comment/commentgood', {
    productId
  })
}

// 获取中评数据
export const getCommitMiddle = (productId) => {
  return request.post('/api/comment/commentmiddle', {
    productId
  })
}
// 获取差评数据
export const getCommitBid = (productId) => {
  return request.post('/api/comment/commentbad', {
    productId
  })
}

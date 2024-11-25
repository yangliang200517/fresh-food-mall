import request from '@/utils/request'

// 获取搜索数据
export const getSearchData = (goodsName) => {
  return request.post('/api/search', {
    goodsName
  })
}

// 获取以价格升序的搜索数据
export const getAscSearchData = (goodsName) => {
  return request.post('/api/searchasc', {
    goodsName
  })
}
// 获取以价格降序的搜索数据
export const getDescSearchData = (goodsName) => {
  return request.post('/api/searchdesc', {
    goodsName
  })
}

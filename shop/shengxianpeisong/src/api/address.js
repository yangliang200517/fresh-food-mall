import request from '@/utils/request'

// 获取用户信息
export const getAddressUser = (userId) => {
  return request.post('/api/addressuser', {
    userId
  })
}

// 获取地址
export const getAddress = (userId) => {
  return request.post('/api/address', {
    userId
  })
}

// 新增地址
export const insNewAddress = (obj) => {
  return request.post('/api/newaddress', {
    ...obj
  })
}

//修改地址
export const setAddress = (obj) => {
  return request.post('/api/updateaddress', {
    ...obj
  })
}

// 删除地址
export const delAddress = (addressId, userId) => {
  return request.post('/api/deleteaddress', {
    addressId,
    userId
  })
}

// 设置默认地址
export const setIsDefaultAddress = (userId, addressId, isDefault) => {
  return request.post('/api/defaultaddress', {
    userId,
    addressId,
    isDefault
  })
}

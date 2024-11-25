import request from '@/utils/request'

// 用户登录
export const userLogin = ({ username, password }) => {
  return request.post('/api/login', {
    username,
    password
  })
}

// 用户注册
export const userReg = ({ username, password, repassword }) => {
  return request.post('/api/reguser', {
    username,
    password,
    repassword
  })
}

// 获取用户信息
export const getUserData = () => {
  return request.get('my/userinfo')
}

// 修改用户信息
export const setUserData = (data) => {
  return request.post('my/userinfo', {
    ...data
  })
}

// 修改管理员头像
export const setAdminPic = (data, formDatas) => {
  return request.post(
    'my/update/avater',
    {
      ...data,
      formDatas
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

// 获取管理员头像
export const getAdminPic = () => {
  return request.get('my/get/avater')
}

// 修改管理员密码
export const updatePassword = (newPwd, oldPwd) => {
  return request.post('my/updatepassword', {
    newPwd,
    oldPwd
  })
}

// 忘记密码
export const forGetPassword = (data) => {
  console.log(data)
  return request.post('/api/forget/password', {
    ...data
  })
}

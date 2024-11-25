import request from '@/utils/request'

// 用户登录
export const userLogin = ({ name, password }) => {
  return request.post('/api/login', {
    name,
    password
  })
}
// 用户注册
export const userReg = ({ name, password, repassword }) => {
  return request.post('/api/reguser', {
    name,
    password,
    repassword
  })
}
// 更换用户头像
export const userAvater = (avater) => {
  return request.post('/my/update/avater', avater, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get('/my/userinfo')
}

// 修改密码
export const regUserPwd = ({ oldPwd, newPwd }) => {
  return request.post('/my/updatepassword', { oldPwd, newPwd })
}

// 更新用户信息
export const updateUserData = ({ user_id, full_name, sex, age, email }) => {
  return request.post('/my/userinfo', { user_id, full_name, sex, age, email })
}

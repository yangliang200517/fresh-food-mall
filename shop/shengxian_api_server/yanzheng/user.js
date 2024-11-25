const joi = require('joi')

const name = joi.string().alphanum().min(3).max(10).required()
const password = joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/).required()

const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
const sex = joi.string().max(1).required()
const age = joi.number().integer().max(100).required()

const avater = joi.string().dataUri().required()

// 定义验证登录和注册的对象
exports.user_data_schema = {
  body: {
    name,
    password
  }
}

// 定义修改用户信息的验证规则对象
exports.update_userinfo = {
  body: {
    user_id: id,
    full_name: nickname,
    sex,
    age,
    email: email
  }
}

// 定义修改密码的验证规则对象
exports.update_password = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref('oldPwd')).concat(password)
  }
}

// 定义修改头像的验证规则对象
exports.uodate_avater = {
  body: {
    avater
  }
}
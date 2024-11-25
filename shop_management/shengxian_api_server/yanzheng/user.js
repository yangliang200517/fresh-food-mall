const joi = require('joi')

const name = joi.string().pattern(/^([\u4e00-\u9fa5]+|[a-zA-Z]+|[\u4e00-\u9fa5a-zA-Z]+)$/).min(2).max(10).required()
const password = joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/).required().messages({
  'string.pattern.base': '密码必须为6-12位，至少包含一个字母和一个数字',
  'any.required': '密码不能为空',
  'string.empty': '密码不能为空'
})

const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const sex = joi.string().max(1).required()
const age = joi.number().integer().max(100).required()
const grade = joi.number().max(1).required()
const email = joi.string().pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/).required()

const avater = joi.string().dataUri().required()
const user_pic = joi.string().dataUri().required()

// 定义验证登录和注册的对象
exports.user_data_schema = {
  body: {
    username: name,
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
  }
}

// 定义修改密码的验证规则对象
exports.update_password = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref('oldPwd')).concat(password).messages({
      'any.invalid': '新密码不能与旧密码相同',
      'string.pattern.base': '新密码必须为6-12位，至少包含一个字母和一个数字',
      'any.required': '新密码不能为空',
      'string.empty': '新密码不能为空'
    })
  }
}

// 定义修改头像的验证规则对象
exports.uodate_avater = {
  body: {
    avater
  }
}

// 定义修改管理员信息的验证规则对象
exports.update_admininfo = {
  body: {
    id,
    name: nickname,
    full_name: nickname,
    sex,
    age,
    grade
  }
}

// 定义修改管理员信息的验证规则对象
exports.update_forgetpwd = {
  body: {
    password,
    email
  }
}

// 定义添加管理员信息的验证规则对象
exports.insert_admin = {
  body: {
    name,
    password,
    sex,
    age,
    grade,
    email
  }
}
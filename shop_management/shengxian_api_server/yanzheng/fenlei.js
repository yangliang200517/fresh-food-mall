const joi = require('joi')

const category_id = joi.number().integer().min(1).required()
const category_name = joi.string().pattern(/^[\u4e00-\u9fa5]{2,5}$/).min(2).max(5).required()
// .messages({
//   'any.required': '分类名称不能为空'
// })

// 定义添加分类验证规则对象
exports.insert_article = {
  body: {
    category_name
  }
}

// 定义修改分类验证规则对象
exports.update_article = {
  body: {
    category_id,
    category_name
  }
}

// 定义删除分类验证规则对象
exports.delete_article = {
  body: {
    category_id
  }
}
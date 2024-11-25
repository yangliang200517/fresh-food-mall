const joi = require('joi')

const selValue = joi.number().integer()
// 定义查找分类验证规则对象
exports.search_article = {
  body: {
    selValue
  }
}

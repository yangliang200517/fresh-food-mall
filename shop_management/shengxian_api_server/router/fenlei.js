const express = require('express')
const fenleiFunc = require('../router_function/fenlei')
const expressJoi = require('@escook/express-joi')
const { insert_article, update_article, delete_article } = require('../yanzheng/fenlei')
const router = express.Router()

// 获取分类
router.get('/article', fenleiFunc.getArticle)
// 添加分类
router.post('/addArticle', expressJoi(insert_article), fenleiFunc.addArticle)
// 修改分类
router.post('/setArticle', expressJoi(update_article), fenleiFunc.changeArticle)
// 删除分类
router.post('/delArticle', expressJoi(delete_article), fenleiFunc.deleteArticle)



module.exports = router
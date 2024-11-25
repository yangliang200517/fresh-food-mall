const express = require('express')
const multer = require('multer')
const path = require('path')
const goodsFunc = require('../router_function/goods')

const router = express.Router()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images'); // 使用相对路径
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now(); // 获取当前时间戳
    const randomString = Math.random().toString(36).substring(2, 8); // 生成随机字符串
    const extension = path.extname(file.originalname); // 获取原始文件的扩展名
    cb(null, `${timestamp}-${randomString}${extension}`); // 结合时间戳、随机字符串和原始文件扩展名生成文件名
  }
});

const upload = multer({ storage: storage });

// 获取商品
router.post('/goods' ,goodsFunc.getProduct)

// 添加或修改商品
router.post('/goods/add', upload.single('product_pic') ,goodsFunc.setOrAddProduct)

// 删除商品
router.post('/goods/delete', goodsFunc.deleteProduct)

// 查询商品评价数据
router.post('/goods/getviews', goodsFunc.getProductRviewsData)

module.exports = router
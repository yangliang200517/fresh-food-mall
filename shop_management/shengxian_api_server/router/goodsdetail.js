const express = require('express')
const multer = require('multer')
const path = require('path')
const goodsDetailFunc = require('../router_function/goodsdetail')
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

const upload = multer({ storage: storage })

// 获取商品信息
router.get('/goods', goodsDetailFunc.getGoods)

// 根据商品表查询商品详情表中的数据
router.post('/goods/getdetail', goodsDetailFunc.getGoodsDetail)

//添加或修改商品详情表中指定的数据
router.post('/goods/pics', upload.single('detail_img'), goodsDetailFunc.setAndAddGoodsDetail)

// 删除商品详情表中指定的数据
router.post('/goods/deldetail', goodsDetailFunc.delGoodsDetail)

module.exports = router

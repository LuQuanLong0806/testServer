
const Router = require('koa-router')

const router = new Router()
const ContentController = require('./../../api/ContentController')

router.prefix('/content')

// 用户上传接口
router.post('/upload', ContentController.uploadFile)

// 发表新帖
router.post('/add', ContentController.addPost)

// 收藏
router.post('/collect', ContentController.collectPost)



module.exports = router
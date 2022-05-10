
const Router = require('koa-router')

const router = new Router()
const ContentController = require('../api/ContentController')

router.prefix('/public')
router.post('/post', ContentController.getPostList)

module.exports = router
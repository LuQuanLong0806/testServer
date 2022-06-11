
const Router = require('koa-router')
const router = new Router()

const CommentsController = require('../../api/CommentsController')

router.prefix('/comments')

// 添加评论
router.post('/reply', CommentsController.addComments)

module.exports = router
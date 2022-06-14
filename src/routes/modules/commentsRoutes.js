
const Router = require('koa-router')
const router = new Router()

const CommentsController = require('../../api/CommentsController')

router.prefix('/comments')

// 添加评论
router.post('/reply', CommentsController.addComment)
// 编辑评论
router.post('/update', CommentsController.updateComment)
// 采纳为最佳答案
router.post('/accept', CommentsController.setBest)
// 点赞
router.post('/hands', CommentsController.setHands)

module.exports = router
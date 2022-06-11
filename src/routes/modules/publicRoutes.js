
const Router = require('koa-router')
const router = new Router()

const PublicController = require('../../api/captcha')
const ContentController = require('../../api/ContentController')
const UserController = require('./../../api/UserController')
const CommentsController = require('../../api/CommentsController')


router.prefix('/public')

// 获取图形验证码
router.get('/captcha', PublicController.getCaptcha)
// 获取文章列表
router.get('/list', ContentController.getPostList)
// 修改用户名
router.get('/resetEail', UserController.updateUserName)
// 获取文章详情
router.get('/content/detail', ContentController.getPostDetail)
router.get('/content/detail', ContentController.getPostDetail)
// 获取评论列表
router.get('/comments', CommentsController.getComments)



module.exports = router
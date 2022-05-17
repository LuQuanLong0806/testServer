
const Router = require('koa-router')

const router = new Router()
const ContentController = require('./../../api/ContentController')
const UserController = require('./../../api/UserController')

router.prefix('/public')
router.post('/post', ContentController.getPostList)

// 修改用户名

router.get('/resetEail', UserController.updateUserName)



module.exports = router
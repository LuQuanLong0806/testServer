
const Router = require('koa-router')

const router = new Router()

const user = require('./../../api/user');

const UserController = require('./../../api/UserController')

// 前缀
router.prefix('/user')

router.get('/user', user)

// 用户签到接口
router.get('/sign', UserController.userSign)

module.exports = router
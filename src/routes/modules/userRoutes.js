
const Router = require('koa-router')

const router = new Router()

const user = require('./../../api/user');

const UserController = require('./../../api/UserController')

// 前缀
router.prefix('/user')

router.get('/user', user)
// 用户签到接口
router.get('/sign', UserController.userSign)
// 更新用户基本信息
router.post('/basic', UserController.updateUserInfo)
router.post('/changePassword', UserController.changePassword)
// 获取用户信息
router.post('/info', UserController.userInfo)



module.exports = router
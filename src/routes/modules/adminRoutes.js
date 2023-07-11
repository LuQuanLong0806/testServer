const Router = require('koa-router')

const router = new Router()

const UserController = require('./../../api/UserController')

router.prefix('/platform');
// 获取用户列表
router.get('/user/list', UserController.getUsers)
// 新增
router.post('/user/add', UserController.addUser)
// 修改
router.post('/user/eidt', UserController.editUserInfo)
// 删除用户信息
router.post('/user/delete', UserController.deleteUser)

module.exports = router

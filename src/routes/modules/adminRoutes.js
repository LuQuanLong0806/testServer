const Router = require('koa-router')

const router = new Router()

const UserController = require('./../../api/UserController')
const AdminController = require('./../../api/adminController')

router.prefix('/admin');
// 获取用户列表
router.get('/user/list', UserController.getUsers)
// 新增
router.post('/user/add', UserController.addUser)
// 修改
router.post('/user/eidt', UserController.editUserInfo)
// 删除用户信息
router.post('/user/delete', UserController.deleteUser)

// 菜单操作
router.post('/menu/add', AdminController.addMenu)
router.post('/menu/delete', AdminController.deleteMenu)
router.post('/menu/update', AdminController.updateMenu)
router.get('/getMenu', AdminController.getMenu)

module.exports = router


const Router = require('koa-router')
const router = new Router()

const LoginController = require('./../../api/login/login')

router.prefix('/login')

router.post('/login', LoginController.login)
router.post('/register', LoginController.reg)
router.post('/forget', LoginController.login)
// 找回密码
router.get('/retrievePwd', LoginController.retrievePwd)
// 重置密码
router.get('/resetPwd', LoginController.resetPwd)


module.exports = router
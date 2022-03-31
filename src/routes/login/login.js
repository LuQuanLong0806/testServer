
const Router = require('koa-router')
const router = new Router()

const LoginController = require('../../api/login/login')

router.prefix('/login')

router.post('/login', LoginController.login)
router.post('/register', LoginController.reg)
router.post('/forget', LoginController.login)

module.exports = router
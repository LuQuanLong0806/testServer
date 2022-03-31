
const Router = require('koa-router')
const router = new Router()


const PublicController = require('../api/captcha')
router.prefix('/public')
router.get('/captcha', PublicController.getCaptcha)

module.exports = router
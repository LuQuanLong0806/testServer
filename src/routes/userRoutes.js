
const Router = require('koa-router')

const router = new Router()

const user = require('../api/user')

router.get('/user', user)

module.exports = router
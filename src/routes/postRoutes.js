
const Router = require('koa-router')

const router = new Router()

const post = require('../api/post')

router.post('/post', post)

module.exports = router
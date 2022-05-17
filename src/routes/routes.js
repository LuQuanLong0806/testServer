
const comBineRouters = require('koa-combine-routers')

const userRoutes = require('./modules/userRoutes')
const postRoutes = require('./modules/postRoutes')
const captcha = require('./modules/captchaRoutes')
const login = require('./modules/loginRoutes')
const content = require('./modules/contentRoutes')

module.exports = comBineRouters(
    userRoutes,
    postRoutes,
    captcha,
    login,
    content
)

// const moduleFiles = require().context('./modules', true, /\.js/)
// export default comBineRouters(
//     userRoutes,
//     postRoutes
// )
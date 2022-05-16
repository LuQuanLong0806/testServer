
const comBineRouters = require('koa-combine-routers')

const userRoutes = require('./modules/userRoutes')
const postRoutes = require('./modules/postRoutes')
const captcha = require('./modules/captchaRoutes')
const login = require('./modules/loginRoutes')

module.exports = comBineRouters(
    userRoutes,
    postRoutes,
    captcha,
    login
)

// const moduleFiles = require().context('./modules', true, /\.js/)
// export default comBineRouters(
//     userRoutes,
//     postRoutes
// )

const comBineRouters = require('koa-combine-routers')

const userRoutes = require('./userRoutes')
const postRoutes = require('./postRoutes')
const captcha = require('./captchaRoutes')
const login = require('./login/login')



module.exports = comBineRouters(
    userRoutes,
    postRoutes,
    captcha,
    login
)

// export default comBineRouters(
//     userRoutes,
//     postRoutes
// )
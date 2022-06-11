// 引入路由合并中间件
const comBineRouters = require('koa-combine-routers')
// 动态引入文件
const path = require('path');
const fs = require('fs');
// 要读取的文件目录
const modules = path.resolve(__dirname, './modules');
const regJS = /\.js/;
const moduleFiles = [];
// 读取要引入的文件夹下的所有js文件
fs.readdirSync(modules).forEach(file => {
    regJS.test(file) && moduleFiles.push(require(modules + '/' + file))
});

module.exports = comBineRouters(
    moduleFiles
)

// 静态引入
// const userRoutes = require('./modules/userRoutes')
// const public = require('./modules/publicRoutes')
// const login = require('./modules/loginRoutes')
// const content = require('./modules/contentRoutes')

// module.exports = comBineRouters(
//     [
//         userRoutes,
//         public,
//         login,
//         content
//     ]
// )



// 使用 es6语法
// import koa from 'koa'
// import path from 'path'
// import koaBody from 'koa-body'
// import helmet from 'koa-helmet'
// import statics from 'koa-static'
// import router from './routes/routes'

const path = require('path')
const koa = require('koa')
const koaBody = require('koa-body')
const helmet = require('koa-helmet')
const statics = require('koa-static')
const koaJson = require('koa-json')
const compose = require('koa-compose');
const cors = require('@koa/cors');

const config = require('./config/index')

const errHandle = require('./common/errHandle')

const JWT = require('koa-jwt')

const router = require('./routes/routes')

const app = new koa();

// 定义公共路径 不需要 JWT 鉴权 , /^\/login/ , /\/login/
const jwt = JWT({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/, /\/login/]});
// app.use(helmet())
// app.use(statics(path.join(__dirname, './public'))) // 托管静态资源
// app.use(koaBody())
const middleware = compose([
    cors(),
    helmet(),
    statics(path.join(__dirname, './public')),
    koaJson(),
    koaBody({
        multipart: true,
        // 限制大小
        formidable: {
            keepExtensions: true,
            maxFieldsSize: 5 * 1024 * 1024
        },
        onError: err => {
            console.log(err);
        }
    }),
    jwt,
    errHandle,
])
app.use(middleware)
app.use(router())

app.listen(9090)




const jsonwebtoken = require('jsonwebtoken')
const config = require('../../config/index')
const bcrypt = require('bcrypt');
const moment = require('moment');
const { checkCapchat } = require('../../common/util')

const User = require('../../model/user');

class LoginController {
    constructor() { }
    async login(ctx) {
        // 1. 接收数据
        // 2. 验证图片验证码的时效性 正确性
        // 3. 验证用户账号密码是否正确
        // 4. 返回 token
        const { body } = ctx.request
        console.log(body);
        // 获取用户传过来的验证码和sid
        let { capchat, sid } = body;
        // 封装一个验证验证码是否正确的方法
        let result = await checkCapchat(sid, capchat);
        if (result) {
            // 验证用户账号密码是否正确
            let user = await User.findOne({ name: body.name })
            if (user) {
                let check = await bcrypt.compare(body.password, user.password)
                // mongoDB 查库
                if (check) {
                    // 设置过期时间
                    // 方法1 通过参数传递 exp: 秒数
                    // let time = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
                    // let token = jsonwebtoken.sign({ _id: 'brain', exp: time },
                    //     config.JWT_SECRET
                    // );
                    // 方法2
                    let token = jsonwebtoken.sign({ _id: 'brain' },
                        config.JWT_SECRET,
                        {
                            expiresIn: '1d' // 1天后过期
                        }
                    );
                    ctx.body = {
                        code: 200,
                        data: {
                            token: token
                        },
                        message: 'success!'
                    }
                } else {
                    ctx.body = {
                        code: 404,
                        message: '用户名或密码不正确!'
                    }
                }
            } else {
                ctx.body = {
                    code: 500,
                    message: '用户不存在!'
                }
            }
        } else {
            ctx.body = {
                code: 401,
                message: '验证码不正确!'
            }
        }
    }

    async reg(ctx) {
        // 1.接收客户端数据
        const { body } = ctx.request
        // 2.检验验证码的内容
        let { capchat, sid } = body;
        let message = {}
        let check = true
        // 封装一个验证验证码是否正确的方法
        let result = await checkCapchat(sid, capchat);
        if (result) {
            // 3.查库查看是否存在 和 nick那么是否存在
            let user1 = await User.findOne({ name: body.name })
            if (user1 && user1.name != 'undefined') {
                message.name = ['用户名已存在']
                check = false
            }
            let user2 = await User.findOne({ nickname: body.nickname })
            if (user2 && user2.nickname != 'undefined') {
                message.nickname = ['昵称已存在']
                check = false
            }
            if (check) {
                body.password = await bcrypt.hash(body.password, 5)
                let user = new User({
                    name: body.name,
                    nickname: body.nickname,
                    password: body.password,
                    created: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                let result = await user.save()
                ctx.body = {
                    code: 200,
                    data: result,
                    message: '注册成功!'
                }
            } else {
                ctx.body = {
                    code: 401,
                    message: message
                }
            }
            // 4.保存数据
        } else {
            message.capchat = ['验证码不正确!']
            ctx.body = {
                code: 401,
                message: message
            }
        }
    }
}

module.exports = new LoginController()
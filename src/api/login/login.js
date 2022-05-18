
const jsonwebtoken = require('jsonwebtoken')
const config = require('../../config/index')
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const { checkCapchat, getJWTPayload } = require('../../common/util')
const User = require('../../model/user');
const SignRecord = require('./../../model/SignRecord');

const send = require('./../../config/MailConfig')
const uuid = require('uuid')
const { setValue, getValue } = require('../../config/RedisConfig');


class LoginController {
    constructor() { }
    // 登录
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
                    // let token = jsonwebtoken.sign({ _id:  user._id , exp: time },
                    //     config.JWT_SECRET
                    // );
                    // 方法2
                    let token = jsonwebtoken.sign({ _id: user._id },
                        config.JWT_SECRET,
                        {
                            expiresIn: '1d' // 1天后过期
                        }
                    );
                    // 去掉用户的敏感信息
                    let userInfo = JSON.parse(JSON.stringify(user))
                    let Arr = ['password', 'name'];
                    Arr.forEach(d => {
                        delete userInfo[d];
                    })

                    let isSign = await SignRecord.findByUid(userInfo._id)

                    if (isSign && isSign.created && dayjs(isSign.created).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
                        userInfo.isSign = true;
                    }

                    // console.log(user);
                    ctx.body = {
                        code: 200,
                        data: {
                            token: token,
                            userInfo: userInfo
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
    // 注册
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
                    created: dayjs().format('YYYY-MM-DD HH:mm:ss')
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
    // 找回密码
    async retrievePwd(ctx) {

        const body = ctx.query;
        if (body.name) {
            // 查看是否存在用户
            const obj = await User.findOne({ name: body.name })
            if (obj) {
                // 如果用户存在 发送邮件 用户点击邮件前往重置密码

                let key = uuid.v4();

                await setValue(key, jsonwebtoken.sign({ _id: obj._id },
                    config.JWT_SECRET, {
                    expiresIn: '30m'
                }
                ))

                await send({
                    type: 'reset',
                    data: {
                        key,
                        name: body.name,
                    },
                    email: body.name,
                    user: obj.nickname,
                    expire: dayjs().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),

                })

                ctx.body = {
                    code: 200,
                    message: '邮件已发送，请前往邮件链接重置密码！'
                }
            } else {
                ctx.body = {
                    code: 500,
                    message: '用户不存在！'
                }
            }

        } else {
            ctx.body = {
                code: 500,
                message: '用户名不能为空！'
            }
        }

    }

    // 重置密码
    async resetPwd(ctx) {
        const body = ctx.query;
        if (body.key) {
            const token = await getValue(body.key)
            const obj = await getJWTPayload('Bearer ' + token)
            if (body.password === body.surepassword) {
                // 密码保存还有问题
                await User.updateOne({ _id: obj._id }, {
                    password: body.password,
                })
                ctx.body = {
                    code: 200,
                    message: '密码重置成功!'
                }
            } else {
                ctx.body = {
                    code: 500,
                    message: {
                        surepassword: '两次密码输入不一致!'
                    }
                }
            }

        }
    }
}

module.exports = new LoginController()
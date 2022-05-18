
const dayjs = require('dayjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const SignRecord = require('./../model/SignRecord');
const { getJWTPayload } = require('./../common/util');

const User = require('../model/user');
const send = require('./../config/MailConfig');
const { setValue, getValue } = require('../config/RedisConfig');

const config = require('./../config');
class UserController {
    // 用户签到接口
    async userSign(ctx) {
        // 用户签到逻辑
        // 1. 取用户的ID
        // 2. 查询用户上一次签到记录
        // 3. 判断签到逻辑

        // 保存用户签到数据
        let newRecord = {}

        // 1.
        const obj = await getJWTPayload(ctx.header.authorization);
        // 2.
        const record = await SignRecord.findByUid(obj._id)

        const user = await User.findById(obj._id)

        // 有历史签到数据
        if (record !== null) {
            // 判断用户上一次签到的记录的created时间是否相同 判断今天是否已签到
            if (dayjs(record.created).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
                // 如果已签到
                ctx.body = {
                    code: 500,
                    data: {
                        favs: user.favs,
                        count: user.count,
                    },
                    message: '用户今天已经签到!'
                }

            } else {
                let count = user.count;
                let fav = 0; // 本次签到增加的积分

                let result = {}

                // 如果今天没有签到
                // 判断上次签到是什么时候
                // 判断是否连续签到
                if (dayjs(record.created).format('YYYY-MM-DD') === dayjs().subtract(1, 'days').format('YYYY - MM - DD')) {
                    // 如果用户上次签到日期 == 昨天  说明用户连续签到
                    count += 1
                    // 用户积分增加逻辑
                    if (count < 5) {
                        fav = 5;
                    } else if (count >= 5 && count < 15) {
                        fav = 10;
                    } else if (count >= 15 && count < 30) {
                        fav = 15;
                    } else if (count >= 30 && count < 100) {
                        fav = 20;
                    } else if (count >= 100 && count < 365) {
                        fav = 30;
                    } else {
                        fav = 50
                    }
                    // 更新
                    await User.updateOne(
                        {
                            _id: obj._id
                        },
                        {
                            // user.favs += fav
                            // user.count += 1
                            $inc: {
                                favs: fav, count: 1
                            }
                        }
                    )

                    result = {
                        favs: user.favs + fav,
                        count: user.count + 1
                    }

                } else {
                    // 用户中断签到
                    fav = 5;
                    // 更新用户表
                    await User.updateOne(
                        {
                            _id: obj._id
                        },
                        {
                            $set: {
                                count: 1
                            },
                            // user.favs += fav
                            // user.count += 1
                            $inc: {
                                favs: fav
                            }
                        }
                    )

                    // 更新签到记录表
                    newRecord = new SignRecord({
                        uid: obj._id,
                        favs: fav,
                    })
                    await newRecord.save()

                    result = {
                        favs: user.favs + 5,
                        count: 1
                    }
                }

                // 返回
                ctx.body = {
                    code: 200,
                    data: result,
                    message: '签到成功!'
                }

            }

        } else {
            // 无签到数据 也就是第一次签到
            await user.updateOne(
                {
                    _id: obj._id,
                },
                {
                    $set: { count: 1 },
                    $inc: { favs: 5 }
                }
            )

            // 新建一条数据
            newRecord = new SignRecord({
                uid: obj._id,
                favs: 5,
            })
            await newRecord.save();

            // 更新用户表

            // 返回数据
            ctx.body = {
                code: 200,
                message: '签到成功!',
                data: {
                    favs: 5,
                    count: 1
                }
            }
        }


    }
    // 更新用户基本信息接口
    async updateUserInfo(ctx) {
        const { body } = ctx.request
        const obj = await getJWTPayload(ctx.header.authorization);
        // 查找用户
        const user = await User.findOne({ _id: obj._id })

        let message = ''
        // 判断用户是否修改了邮箱
        if (body.name && body.name !== user.name) {

            // 判断新邮箱是否已存在
            const temUser = await User.findOne({ name: body.name })
            if (temUser && temUser.password) {
                ctx.body = {
                    code: 501,
                    message: '邮箱已被绑定!'
                }
                return
            }

            // 用户修改了邮箱
            const key = uuid.v4();
            setValue(key, jwt.sign({ _id: obj._id },
                config.JWT_SECRET, {
                expiresIn: '30m'
            }
            ))
            // 发送reset邮件
            await send({
                type: 'email',
                data: {
                    key: key,
                    name: body.name
                },
                key: key,
                code: '',
                expire: dayjs().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                email: user.name,
                user: user.nickname
            })

            message = '基本资料更新成功! 账号修改需要邮件确认!'
        }

        // 无论是否修改邮箱 基本资料都要更新
        const arr = ['mobile', 'password', 'name']
        arr.map(d => { delete body[d] })
        const result = await User.updateOne(
            { _id: obj._id },
            body
        )
        if (result) {
            ctx.body = {
                code: 200,
                message: message ? message : '更新成功!',
                data: body
            }
        } else {
            ctx.body = {
                code: 500,
                message: '更新失败!'
            }
        }
    }
    // 更新用户名
    async updateUserName(ctx) {
        const body = ctx.query;
        if (body.key) {
            const token = getValue(body.key)
            const obj = await getJWTPayload('Bearer ' + token)
            await User.updateOne({ _id: obj._id }, {
                name: body.name
            })
            ctx.body = {
                code: 200,
                message: '用户名更改成功!'
            }
        }
    }
    // 修改密码接口
    async changePassword(ctx) {
        const { body } = ctx.request

        const obj = await getJWTPayload(ctx.header.authorization);

        const user = await User.findOne({ _id: obj._id })
        // 如果当前密码和数据库密码一致 就更新新密码
        if (body.newpwd !== body.surepassword || await bcrypt.compare(body.oldpwd, user.password)) {
            const newpassword = await bcrypt.hash(body.newpwd, 5)
            const result = await User.updateOne(
                { _id: obj._id },
                { $set: { password: newpassword } }
            )
            ctx.body = {
                code: 200,
                message: '密码修改成功!请重新登录!'
            }
        } else {
            ctx.body = {
                code: 500,
                message: '密码修改失败, 请检查输入是否正确!'
            }
        }

    }

    // 获取用户信息接口
    async userInfo(ctx) {
        const { body } = ctx.request

        if (body.name) {
            const result = await User.findOne({
                name: body.name
            })

            let arr = ['password'];
            let obj = JSON.parse(JSON.stringify(result))
            arr.map(d => { delete obj[d] })
            ctx.body = {
                code: 200,
                data: obj,
                message: 'SUCCESS!'
            }

        }

    }
}

module.exports = new UserController()
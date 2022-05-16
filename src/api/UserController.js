
const dayjs = require('dayjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const SignRecord = require('./../model/SignRecord');
const { getJWTPayload } = require('./../common/util');

const User = require('../model/user');
const send = require('./../config/MailConfig');
const { setValue } = require('../config/RedisConfig');

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
    // 判断用户是否修改了邮箱
    if (body.name && body.name !== user.nam) {
      // 用户修改了邮箱
      const key = uuid();
      setValue(key, jwt.sign({ _id: obj._id },
        config.JWT_SECRET, {
        expiresIn: '30m'
      }
      ))
      // 发送reset邮件
      const result = await send({
        token: '',
        type: 'email',
        key: key,
        code: '',
        expire: dayjs().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: user.name,
        user: user.nickname
      })
      ctx.body = {
        code: 500,
        data: result,
        message: '邮件发送成功!请点击链接重新绑定邮箱!'
      }


    } else {
      const arr = ['mobile', 'password']
      arr.map(d => { delete body[d] })

      const result = await User.update(
        { _id: obj._id },
        body
      )

      if (result.n === 1 && result.ok === 1) {
        ctx.body = {
          code: 200,
          message: '更新成功!'
        }
      } else {
        ctx.body = {
          code: 500,
          message: '更新失败!'
        }
      }
    }
  }
}

module.exports = new UserController()
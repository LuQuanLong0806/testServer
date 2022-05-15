const { getValue, setValue } = require('../config/RedisConfig');
const jwt = require('jsonwebtoken');
const config = require('./../config');

const getJWTPayload = token => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

const checkCapchat = async (sid, value) => {
  // 获取之前的验证码
  let code = await getValue(sid)
  let res = false
  if (code) {
    if (value.toLowerCase() == code.toLowerCase()) {
      res = true
    }
  }
  return res
}

module.exports = {
  checkCapchat,
  getJWTPayload
}
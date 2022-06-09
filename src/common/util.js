const { getValue, setValue } = require('../config/RedisConfig');
const jwt = require('jsonwebtoken');
const config = require('./../config');

const fs = require('fs');
const path = require('path');

const getJWTPayload = token => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

const checkCaptcha = async (sid, value) => {
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

const rename = (obj, key, newKey) => {
  if (Object.keys(obj).indexOf(key) != -1) {
    obj[newKey] = obj[key]
    delete obj[key]
  }
  return obj
}


const mkdir = path => {
  return new Promise(resolve => {
    fs.mkdir(dir, err => err ? resolve(false) : resolve(true))
  })
}

const getStats = (path) => {
  return new Promise((resolve) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(stats)
      }
    })
  })
}

// 循环遍历 递归判断 如果上级目录不存在则创建上层目录
const dirExists = async (dir) => {
  const isExists = await getStats(dir)
  // 如果该路径存在并且不是文件 返回true
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    // 如果是文件 返回 false
    return false
  }
  // 如果该路径不存在
  const tempDir = path.parse(dir).dir
  // 循环遍历 递归判断 如果上级目录不存在则产生上级目录
  const status = await dirExists(tempDir)
  if (status) {
    const result = await mkdir(dir)
    return result
  } else {
    return false
  }
}

module.exports = {
  checkCaptcha,
  getJWTPayload,
  dirExists,
  rename
}
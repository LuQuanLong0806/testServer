
// 
const mongoose = require('../config/DBHelper');
const Schema = mongoose.Schema
// 定义数据类型
const UserSchema = new Schema({
  name: { type: String },
  password: { type: String },
  nickname: { type: String }
})

const User = mongoose.model('users', UserSchema)

module.exports = User
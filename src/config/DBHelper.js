
const mongoose = require('mongoose');

const { DB_URL } = require('./index');

// 创建连接 
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 连接成功

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + DB_URL);
})

// 连接异常  监听 error 事件
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:' + err);
})

// 断开链接

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected!')
})

module.exports = mongoose
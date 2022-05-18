const path = require('path');

// mongodb 服务器地址
const DB_URL = 'mongodb://luql:123456@1.116.162.124:27017/testdb';
// 链接redis配置
const Redis = {
  host: '1.116.162.124',
  port: 15001,
  password: '123456'
}
// JWT_SECRET
const JWT_SECRET = 'aWS!23&*HJSH$!&*ASF!%^5523*SAFL^5AF2z56sf5wAF*@5#%!%SF55q85'

const baseUrl = 'http://localhost:8080';

const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public' :
  path.join(path.resolve(__dirname, '../public'))

module.exports = {
  DB_URL: DB_URL,
  Redis: Redis,
  JWT_SECRET,
  baseUrl,
  uploadPath
}
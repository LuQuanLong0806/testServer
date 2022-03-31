const CONFIG = require('./index')

const { createClient } = require('redis');

const options = {
  socket: {
    host: CONFIG.Redis.host, // ip
    port: CONFIG.Redis.port, // redis 服务 运行的端口
  },
  password: CONFIG.Redis.password,
  // detect_buffers: true,
};

const client = createClient(options);
(async () => {
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  console.log('连接成功!')
})();

const setValue = (key, value, time = null) => {
  if (value === 'undefined' || !value) {
    return 'err'
  }
  // set 方法 第三个参数 是个配置项 { EX: 10 }  代表过期时间10秒
  if (typeof value === 'string') {
    if (time) {
      client.set(key, value, {
        EX: time
      })
    } else {
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    // 使用哈希表创建
    Object.keys(value).forEach(d => {
      client.hSet(key, d, value[d], () => {
        console.log('set success!');
      })
    })
  }
}

// get 方法1
const getValue = (key) => {
  return client.get(key)
  // return client.hGetAll(key)

}

const getHValue = (key) => {
  return client.hGetAll(key)
}

module.exports = {
  client,
  getValue,
  setValue,
  getHValue
}
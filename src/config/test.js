
const { getValue, setValue, getHValue } = require('./RedisConfig');
let obj = {
  age: 28,
};
(async () => {
  await setValue('customObj', obj)
  // getValue('customObj').then(res => {
  //   console.log(res)
  // })
  getHValue('customObj').then(res => {
    console.log('res', res, res.name + '是' + res.description)
  })
})()


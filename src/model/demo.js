
const User = require('./user');

// 增
const user = {
  name: 'luql',
  age: 18,
  email: '123@qq.com'
}

const save = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result);
}
// save()
// 查
const find = async () => {
  const result = await User.find()
  console.log(result);
}
// find()
// 改
const update = async () => {
  const result = await User.updateOne(
    { name: 'luql' },
    { $set: { email: 'abcd@qq.com' } }
  )
  console.log(result);
}
// update()
// 删
const deleteMethod = async () => {
  const result = await User.deleteOne(
    { name: '测试1' },
  )
  console.log(result);
}
// deleteMethod()
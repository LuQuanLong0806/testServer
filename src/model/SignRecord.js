
const dayjs = require('dayjs');
const mongoose = require('../config/DBHelper');

const Schema = mongoose.Schema

const SignRecordSchema = new Schema({
  uid: { type: String, ref: 'users ' },
  created: { type: Date },
  favs: { type: Number },
})


SignRecordSchema.pre('save', function (next) {
  this.created = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SignRecordSchema.statics = {
  findByUid: function (uid) {
    return this.findOne({ uid }).sort({ created: -1 })
  }
}


// 让mongoDB和我们创建的结构做个对应
const SignRecord = mongoose.model('sign_record', SignRecordSchema)

module.exports = SignRecord
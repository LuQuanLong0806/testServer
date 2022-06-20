// 引入 mongoose
const mongoose = require('../config/DBHelper');
const dayjs = require('dayjs');

const Schema = mongoose.Schema
// 
const CollectionSchema = new Schema({
    uid: { type: String }, // 用户id
    tid: { type: String }, // 帖子id
    created: { type: String } // 收藏时间
})

// 保存之前
CollectionSchema.pre('save', function (next) {
    this.created = dayjs().format('YYYY-MM-DD hh:ss:mm')
    next()
})

CollectionSchema.post('save', function (error, doc, next) {
    if (error.name == 'MongoError' && error.code === 11000) {
        next(new Error('Error: Mongoose has a duplicate key.'))
    } else {
        next(error)
    }
})

const Collections = mongoose.model('collections', CollectionSchema)

module.exports = Collections

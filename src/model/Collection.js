// 引入 mongoose
const mongoose = require('../config/DBHelper');
const dayjs = require('dayjs');

const Schema = mongoose.Schema
// 
const CollectionSchema = new Schema({
    uid: { type: String }, // 用户id
    tid: { type: String }, // 帖子id
    created: { type: String }, // 收藏时间
    title: { type: String }, // 
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

CollectionSchema.statics = {
    /**
     * @param {Object} options 筛选条件
     * @param { Number } limit 分页条数
     * @param { Number } page 分页页数
     * @param { Number } sort 排序方式
     */
    getList(options, page, limit, sort) {
        return this.find(options)
            .skip((page - 1) * limit)
            .limit(limit)
    }
}

const Collections = mongoose.model('collections', CollectionSchema)

module.exports = Collections

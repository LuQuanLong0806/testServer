
// 定义数据结构
const mongoose = require('../config/DBHelper');
const dayjs = require('dayjs');

const Schema = mongoose.Schema
// 定义数据类型
const CommentsHandsSchema = new Schema({
    tid: { type: String, ref: 'posts' }, // ref 指定的链接表名
    cuid: { type: String, ref: 'users' }, // ref 指定的链接表名
    created: { type: Date },
    hands: { type: Number, default: 0 },
})

// 保存的时候自动设置时间
CommentsHandsSchema.pre('save', function (next) {
    this.created = dayjs().format('YYYY-MM-DD HH:mm:ss');
    next()
})

CommentsHandsSchema.statics = {
    /**
     * 获取文章了列表数据
     * @param {Object} options 筛选条件
     * @param {String} sort 排序方式
     * @param {Number} page 分页页数
     * @param {Number} limit 分页条数
     * @returns 
     */

    findByTid: function (id) {
        return this.find({ _id: id })
    }
}

const CommentsHands = mongoose.model('comments_hands', CommentsHandsSchema)

module.exports = CommentsHands
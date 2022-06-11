
// 定义数据结构
const mongoose = require('../config/DBHelper');
const dayjs = require('dayjs');

const Schema = mongoose.Schema
// 定义数据类型
const CommentsSchema = new Schema({
    tid: { type: String, ref: 'posts' }, // ref 指定的链接表名
    cuid: { type: String, ref: 'users' }, // ref 指定的链接表名  对应这张表的_id属性
    created: { type: Date },
    content: { type: String },
    hands: { type: Number, default: 0 },
    status: { type: String, default: '0' },
    isRead: { type: String, default: '0' },
    isBest: { type: String, default: '0' },
})

// 保存的时候自动设置时间
CommentsSchema.pre('save', function (next) {
    this.created = dayjs().format('YYYY-MM-DD HH:mm:ss');
    next()
})

CommentsSchema.statics = {
    /**
     * 获取文章了列表数据
     * @param {Object} tid 筛选条件
     * @param {Number} page 分页页数
     * @param {Number} limit 分页条数
     * @returns 
     */
    getCommentsList: function (tid, page, limit) {
        return this.find({
            tid
        })
            .skip(page * limit) // 页数
            .limit(limit) // 条数
            .populate({
                path: 'cuid', // 这个字段对应的 ref 表名 
                select: '_id nickname isVip pic', // 选取这张表的属性
                match: { status: { $eq: '0' } } // 查询条件
            }) // 设置用户信息
            .populate({
                path: 'tid',
                select: '_id title status'
            }) // 文章信息
    },

    // 获取数量的方法
    queryColunt(tid) {
        return this.find({
            tid
        }).countDocuments();
    },
    findByTid: function (id) {
        // mogoose de populate 方法
        return this.findOne({ tid: id }).populate({
            path: 'cuid',
            select: 'nickname pic isVip _id'
        })
    }
}

const Comments = mongoose.model('comments', CommentsSchema)

module.exports = Comments
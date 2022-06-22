
// 定义数据结构
const mongoose = require('../config/DBHelper');
const dayjs = require('dayjs');

const Schema = mongoose.Schema
// 定义数据类型
const PostSchema = new Schema({
    uid: { type: String, ref: 'users' }, // ref 指定的链接表名
    title: { type: String },
    created: { type: Date },
    catalog: { type: String },
    content: { type: String },
    // pic: { type: String, default: '/public/Img/dog.png' },
    pic: { type: String },
    fav: { type: String },
    isEnd: { type: String, default: '0' },
    reads: { type: Number, default: 0 },
    answer: { type: Number, default: 0 },
    status: { type: String, default: '0' },
    isTop: { type: String, default: '0' },
    topNum: { type: Number },
    sort: { type: Number, default: 0 },
    tags: { type: Array },
})

// 保存的时候自动设置时间
PostSchema.pre('save', function (next) {
    this.created = dayjs().format('YYYY-MM-DD HH:mm:ss');
    next()
})

PostSchema.statics = {
    /**
     * 获取文章了列表数据
     * @param {Object} options 筛选条件
     * @param {String} sort 排序方式
     * @param {Number} page 分页页数
     * @param {Number} limit 分页条数
     * @returns 
     */
    getList: function (options, sort, page, limit) {
        return this.find(options)
            .sort({ [sort]: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'uid',
                select: 'name isVip pic'
            })
    },

    findByTid: function (id) {
        // mogoose de populate 方法
        return this.findOne({ _id: id }).populate({
            path: 'uid',
            select: 'nickname pic isVip _id'
        })
    }
}

const PostModel = mongoose.model('posts', PostSchema)

module.exports = PostModel
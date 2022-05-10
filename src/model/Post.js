
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
    fav: { type: String },
    isEnd: { type: String },
    reads: { type: Number },
    pic: { type: Number, default: '/public/Img/dog.png' },
    answer: { type: Number },
    status: { type: String },
    isTop: { type: String },
    topNum: { type: Number },
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
            .skip(page * limit)
            .limit(limit)
            .populate({
                path: 'uid',
                select: 'name isVip pic'
            })
    }
}

const PostModel = mongoose.model('posts', PostSchema)

module.exports = PostModel
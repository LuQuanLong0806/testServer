const dayjs = require('dayjs')
// 
const mongoose = require('../config/DBHelper');
const Schema = mongoose.Schema
// 定义数据类型
const UserSchema = new Schema({
    name: { type: String, index: { unique: true }, sparse: true },
    password: { type: String },
    nickname: { type: String },
    uid: { type: String },
    created: { type: Date },
    updated: { type: Date },
    favs: { type: Number, default: 100 },
    gender: { type: String },
    roles: { type: Array },
    pic: { type: String },
    mobile: { type: String, match: /^1[3-9](\d{9})/, default: '' },
    status: { type: String, default: 0 },
    regmark: { type: String },
    location: { type: String },
    isVip: { type: String, default: '0' },
    isSign: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
})

UserSchema.pre('save', function (next) {
    this.created = dayjs().format('YYYY-MM-DD hh:mm:ss')
    next()
})


UserSchema.pre('updateOne', function (next) {
    this.updated = dayjs().format('YYYY-MM-DD hh:mm:ss')
    next()
})

UserSchema.pre('update', function (next) {
    this.updated = dayjs().format('YYYY-MM-DD hh:mm:ss')
    next()
})


UserSchema.post('save', function (error, doc, next) {
    if (error.name == 'MongoError' && error.code === 11000) {
        next(new Error('Error: Mongoose has a duplicate key.'))
    } else {
        next(error)
    }
})

UserSchema.statics = {
    findByID: function (id) {
        return this.findOne({ _id: id }, {
            password: 0,
            username: 0,
            mobile: 0
        })
    },
    getList: function (options, sort, page, limit) {
        return this.find(options, {
            password: 0,
        }
        )
            .sort({ [sort]: -1 })
            .skip(page * limit)
            .limit(limit)
    }
}

const User = mongoose.model('users', UserSchema)

module.exports = User
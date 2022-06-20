
const fs = require('fs');
const uuid = require('uuid');
const dayjs = require('dayjs');
const mkdir = require('make-dir');


const Post = require('./../model/Post')

const config = require('./../config');

const User = require('./../model/user');

const Collection = require('./../model/Collection')

const { getJWTPayload, checkCaptcha, rename } = require('./../common/util');

class ContentController {
    async getPostList(ctx) {
        const body = ctx.query

        const sort = body.sort ? body.sort : 'created';
        const page = body.page ? parseInt(body.page) : 0;
        const limit = body.limit ? parseInt(body.limit) : 20;

        let options = {}

        if (typeof body.catalog != 'undefined' && body.catalog !== '') {
            options.catalog = body.catalog
        }
        if (typeof body.isTop != 'undefined') {
            options.isTop = body.isTop
        }
        if (typeof body.status != 'undefined' && body.status != '') {
            options.isEnd = body.status
        }

        // if (typeof body.tag != 'undefined' && body.tag != '') {
        //     options.tags = { $elementMatch: { name: body.tag } }
        // }
        const result = await Post.getList(options, sort, page, limit)
        ctx.body = {
            code: 200,
            data: result,
            // data: post,
            message: 'success'
        }
    }
    // 上传
    async uploadFile(ctx) {
        const file = ctx.request.files.file
        // 图片名称 图片格式 存储位置 返回前台可读取的路径
        const ext = file.name.split('.').pop()
        const dir = `${config.uploadPath}/${dayjs().format('YYYYMMDD')}`
        // 判断路径是否存在  不存在则创建
        // await Util.dirExists(dir)
        await mkdir(dir)
        // 存储文件到指定路径 
        // 给文件唯一名称
        const picname = uuid.v4();
        const destPath = `${dir}/${picname}.${ext}`
        const reader = fs.createReadStream(file.path)
        const upStream = fs.createWriteStream(destPath)
        const filePath = `/${dayjs().format('YYYYMMDD')}/${picname}.${ext}`

        // 手动拼接 
        const url = config.fileUrl + filePath

        // mehtod1
        reader.pipe(upStream)
        // method2
        // let totalLength = 0
        // reader.on('data', chunk => {
        //     totalLength += chunk.length
        //     if (upStream.write(chunk) === false) {
        //         reader.pause()
        //     }
        // })
        // reader.on('drain', () => {
        //     reader.resume()
        // })
        // reader.on('end', () => {
        //     upStream.end()
        // })
        //更新用户表里的头像信息

        const obj = await getJWTPayload(ctx.header.authorization)

        await User.updateOne({
            _id: obj._id
        },
            {
                $set: {
                    pic: url
                }
            }
        )

        // 返回数据
        ctx.body = {
            code: 200,
            message: '上传成功!',
            data: url
        }
    }
    // 发帖
    async addPost(ctx) {
        const { body } = ctx.request
        const { captcha, sid } = body
        // 验证图片验证码的时效性, 正确性
        const result = await checkCaptcha(sid, captcha)


        if (result) {
            const obj = await getJWTPayload(ctx.header.authorization)
            const userObj = await User.findById({ _id: obj._id })
            // 判断用户的积分数是否>fav 否则 用户积分不足

            if (userObj.favs < body.fav) {
                ctx.body = {
                    code: 501,
                    message: '积分不足!'
                }
                return
            } else {
                // 用户积分足够 发帖 减除用户积分
                await User.updateOne({ _id: obj._id }, {
                    $inc: {
                        favs: -body.fav
                    }
                })
            }
            const newPost = new Post(body)
            newPost.uid = obj._id;
            const result = await newPost.save();
            ctx.body = {
                code: 200,
                message: '发布成功!',
                data: result
            }

        } else {
            ctx.body = {
                code: 500,
                message: '验证码不正确!',
            }
        }
    }

    // 帖子详情
    async getPostDetail(ctx) {
        const params = ctx.query;
        const obj = getJWTPayload(ctx.header.authorization)
        if (!params.tid) {
            ctx.body = {
                code: 500,
                message: '文章id不能为空!',
            }
        } else {

            await Post.updateOne({
                _id: params.tid
            }, {
                $inc: {
                    reads: 1
                }
            })

            const post = await Post.findByTid(params.tid)

            // const result = rename(JSON.parse(JSON.stringify(post)), 'uid', 'user')
            const result = JSON.parse(JSON.stringify(post))
            // 是否收藏帖子
            if (obj._id && typeof obj._id != 'undefined') {
                const cols = await Collection.find({ tid: params.tid, uid: obj._id })
                if (cols && cols.length > 0) {
                    result.isCollect = 1
                }
            }
            ctx.body = {
                code: 200,
                message: 'success!',
                data: result
            }
        }


    }

    // 收藏帖子
    async collectPost(ctx) {
        // uid  tid
        const { body } = ctx.request
        // 是否传参
        const obj = getJWTPayload(ctx.header.authorization)
        if (typeof body.tid == 'undefined' || !body.tid) {
            ctx.body = {
                code: 500,
                message: 'id不能为空!',
            }
            return
        }
        if (typeof obj._id == 'undefined' || !obj._id) {
            ctx.body = {
                code: 401,
                message: '登录后再进行操作!',
            }
            return
        }

        // 是否已收藏
        const cts = await Collection.find({ tid: body.tid, uid: obj._id })
        if (cts && cts.length > 0) {
            ctx.body = {
                code: 500,
                message: '已经收藏过了!',
            }
        } else {
            const collect = new Collection({
                tid: body.tid,
                uid: obj._id
            })
            // 
            const result = await collect.save()
            if (result) {
                ctx.body = {
                    code: 200,
                    message: '收藏成功!',
                }
            } else {
                ctx.body = {
                    code: 500,
                    message: '收藏失败!',
                }
            }
        }


    }
    // 取消收藏
    async cancelCollect(ctx) {

    }

}

module.exports = new ContentController()

const Post = require('./../model/Post')
const fs = require('fs');
const uuid = require('uuid');
const dayjs = require('dayjs');

const config = require('./../config');

const User = require('./../model/user');

const { getJWTPayload } = require('./../common/util');

const mkdir = require('make-dir');
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

        if (typeof body.tag != 'undefined' && body.tag != '') {
            options.tags = { $elementMatch: { name: body.tag } }
        }
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
        const url = 'http://localhost:9090' + filePath

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
}

module.exports = new ContentController()
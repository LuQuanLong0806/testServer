
// const dayjs = require('dayjs');
// const Post = require('./../model/Post')
// const config = require('./../config');
// const User = require('./../model/user');
const { getJWTPayload, checkCaptcha } = require('./../common/util');
const Comments = require('./../model/Comments');

class CommentsController {
    // 获取评论列表
    async getComments(ctx) {
        const params = ctx.query
        // 获取页数
        const page = params.page ? parseInt(params.page) : 0;
        // 获取长度
        const limit = params.limit ? parseInt(params.limit) : 20;
        // 获取查询结果
        const result = await Comments.getCommentsList(params.tid, page, limit)
        // 总数
        const total = await Comments.queryColunt(params.tid)
        // 查询用户是否点赞

        ctx.body = {
            code: 200,
            data: result,
            total: total,
            // data: post,
            message: 'success'
        }
    }

    // 添加评论
    async addComments(ctx) {
        const { body } = ctx.request
        // 判断验证码是否正确
        let check = true // await checkCaptcha(body.sid, body.code)
        if (check) {
            // 添加评论内容
            const comments = new Comments(body)
            const obj = getJWTPayload(ctx.header.authorization)
            comments.cuid = obj._id // 设置cuid
            await comments.save() // 保存
            ctx.body = {
                code: 200,
                message: 'success!'
            }
        } else {
            // 查询用户是否点赞
            ctx.body = {
                code: 500,
                message: {
                    captcha: ['验证码不正确!']
                }
            }
        }


    }
}

module.exports = new CommentsController()
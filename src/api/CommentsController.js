
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
    async addComment(ctx) {
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
    // 更新评论
    async updateComment(ctx) {
        const { body } = ctx.request
        // 判断验证码是否正确
        let check = true // await checkCaptcha(body.sid, body.code)
        if (check) {
            // 需要评论的数据 id 和 用户id
            if (!body.id) {
                ctx.body = {
                    code: 401,
                    message: 'id不能为空!'
                }
            } else {
                // 判断用户id是否相同
                const coment = await Comments.findOne({
                    _id: body.id
                })
                if (body.cuid !== coment.cuid) {
                    // 非本人操作
                    ctx.body = {
                        code: 500,
                        message: '只有本人才可更改评论!'
                    }
                } else if (false) {
                    // 判断用户是否被禁言

                }
                else {

                    // 更新并返回
                    // const obj = getJWTPayload(ctx.header.authorization)

                    // 添加评论内容
                    const result = await Comments.updateOne({
                        _id: body.id
                    }, {
                        $set: {
                            content: body.content,
                        }
                    })

                    console.log('result', result);
                    ctx.body = {
                        code: 200,
                        data: result,
                        message: 'success!'
                    }
                }
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
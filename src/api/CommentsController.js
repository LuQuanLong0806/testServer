
// const dayjs = require('dayjs');
// const config = require('./../config');
const CommentsHands = require('../model/CommentsHands');
const { getJWTPayload, checkCaptcha } = require('./../common/util');
const Comments = require('./../model/Comments');
const Post = require('./../model/Post')
const User = require('./../model/user');

const canReply = async (ctx) => {
    const obj = getJWTPayload(ctx.header.authorization)
    if (!obj._id || typeof obj._id == 'undefined') {
        return false
    } else {
        const result = await User.findById(id)
        if (result.status == 0) {
            return true
        }
    }
}

class CommentsController {
    // 获取评论列表
    async getComments(ctx) {
        const params = ctx.query
        const obj = getJWTPayload(ctx.header.authorization)
        // 获取页数
        const page = params.page ? parseInt(params.page) : 0;
        // 获取长度
        const limit = params.limit ? parseInt(params.limit) : 20;
        // 获取查询结果
        const result = JSON.parse(JSON.stringify(await Comments.getCommentsList(params.tid, page, limit)))

        // 如果cid 和 uid 都匹配 说明点过了
        if (obj._id && typeof obj._id !== 'undefined') {
            for (let i = 0; i < result.length; i++) {
                let arr = await CommentsHands.find({ cid: result[i]._id, uid: obj._id })
                if (arr.length > 0) {
                    result[i].handed = 1
                }
            }
        }

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
        let result = canReply(ctx)
        if (!result) {
            ctx.body = {
                code: 500,
                message: '用户已被禁言!'
            }
            return
        }
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
        let result = canReply(ctx)
        if (!result) {
            ctx.body = {
                code: 500,
                message: '用户已被禁言!'
            }
            return
        }
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

    // 采纳
    async setBest(ctx) {
        // 所以需要帖子 id 和 评论id
        //  要把帖子设为完结
        const { body } = ctx.request

        const obj = getJWTPayload(ctx.header.authorization)
        // 判断用户是否存在
        if (obj && obj._id != '') {
            // 判断用户是否是发帖人
            const post = await Post.findOne({ _id: body.tid })
            if (post.uid === obj._id && post.isEnd == 0) {

                const result = await Post.updateOne({ _id: body.tid }, {
                    $set: {
                        isEnd: '1'
                    }
                })
                // 评论设为1
                const comment = await Comments.updateOne({ _id: body.cid }, {
                    $set: {
                        isBest: '1'
                    }
                })
                // 如果 result 和 comment 都成功
                if (result.acknowledged && comment.acknowledged) {
                    // 将积分加到被采纳的人
                    let fav = post.fav;
                    const u = await Comments.findById(body.cid)
                    const u2 = await User.updateOne({ _id: u.cuid }, {
                        $inc: {
                            favs: fav
                        }
                    })
                    if (u2.acknowledged) {
                        ctx.body = {
                            code: 200,
                            message: '已采纳!',
                        }
                    } else {
                        ctx.body = {
                            code: 500,
                            message: '设置最佳答案-更新用户信息失败!',
                        }
                    }
                } else {
                    ctx.body = {
                        code: 500,
                        message: '操作失败!',
                    }
                }

            } else {
                ctx.body = {
                    code: 500,
                    message: '设置失败!帖子已完结或者用户无权限!',
                }
            }
        } else {
            ctx.body = {
                code: 500,
                message: '用户未登录或用户不存在!',
            }

        }



    }

    // 点赞
    async setHands(ctx) {
        const obj = getJWTPayload(ctx.header.authorization)
        if (!obj._id || typeof obj._id === 'undefined') {
            ctx.body = {
                code: 401,
                message: '需要先登录!'
            }
            return
        }
        const { body } = ctx.request
        // 判断是否已经点赞
        const tmp = await CommentsHands.find({ cid: body.cid, uid: obj._id })
        if (tmp.length > 0) {
            ctx.body = {
                code: 500,
                message: '您已经点过赞了,请勿重复点赞!'
            }
            return
        }
        // 新增点赞记录
        const Hands = new CommentsHands({
            cid: body.cid, // 评论id
            uid: obj._id // 用户id
        })
        const result = await Hands.save()
        if (result) {
            // 更新 对应 comments表中的  hands +1
            await Comments.updateOne({ _id: body.cid }, {
                $inc: {
                    hands: 1
                }
            })
            ctx.body = {
                code: 200,
                message: '点赞成功!'
            }
        } else {
            ctx.body = {
                code: 500,
                message: '服务器错误!'
            }
        }
    }
}

module.exports = new CommentsController()
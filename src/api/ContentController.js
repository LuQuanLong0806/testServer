
const Post = require('./../model/Post')

class ContentController {
    async getPostList(ctx) {
        const body = ctx.query
        // 测试数据
        // const post = new Post({
        //     title: 'title',
        //     content: 'content',
        //     catalog: 'ask',
        //     fav: '0',
        //     isEnd: '0',
        //     reads: '0',
        //     answer: '0',
        //     status: '0',
        //     isTop: '0',
        //     sort: '0',
        //     tags: [
        //         { name: '精华', class: '' },
        //         { name: '置顶', class: '' },
        //     ],
        // })
        // const tmp = await post.save()

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
}

module.exports = new ContentController()
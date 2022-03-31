let post = function (ctx) {
    let {body} = ctx.request
    if (body.name) {
        ctx.body = 'Hello,' + body.name + '!'
    } else {
        ctx.body = 'Hello, 新用户!'
    }
}

module.exports = post
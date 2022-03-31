let user = function (ctx) {
    let body = ctx.request.query
    if (body.name) {
        ctx.body = 'Hello,' + body.name + '!'
    } else {
        ctx.body = 'Hello, 新用户!'
    }
}

module.exports = user
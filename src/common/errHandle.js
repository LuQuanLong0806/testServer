module.exports = (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                error: err.originalError ? err.originalError.message : err.message
            };
        } else {
            ctx.status = err.status || 500
            ctx.body = Object.assign(
                {
                    code: 500,
                    message: err.message
                },
                process.env.NODE_ENV == 'development' ? { stack: err.stack } : {}
            )
            // err.stack 错误的具体信息
            console.log(err.stack)
        }
    });
}
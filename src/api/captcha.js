
const svgCaptcha = require('svg-captcha');

const { getValue, setValue } = require('../config/RedisConfig');

class PublicController {
    constructor() { }
    async getCaptcha(ctx) {

        const body = ctx.request.query

        console.log('sid', body.sid);

        const newCaptcha = svgCaptcha.create({
            noise: Math.floor(Math.random() * 6),
            color: true,
            ignoreChars: '0o1li'
        })
        // {
        //     text: 'xxxx', 
        //     data: 'base64'
        // }
        console.log('newCaptcha', newCaptcha.text);
        // 保存图片验证码数据 设置超时时间  单位 : s
        setValue(body.sid, newCaptcha.text, 60)
        // getValue(body.sid).then(res => {
        //     console.log('getValue', res);
        // })
        ctx.body = {
            code: 200,
            data: newCaptcha.data,
            message: 'success!'
        }
    }
}

module.exports = new PublicController()
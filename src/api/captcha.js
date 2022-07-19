
const svgCaptcha = require('svg-captcha');

const { getValue, setValue } = require('../config/RedisConfig');

class PublicController {
    constructor() { }
    async getCaptcha(ctx) {

        const body = ctx.request.query

        const newCaptcha = svgCaptcha.create({
            noise: Math.floor(Math.random() * 6),
            color: true,
            ignoreChars: '0o1li'
        })

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

    // 测试滑块验证码验证
    async isVerify(ctx) {
        const { body } = ctx.request;
        let value = body.value;
        let datas = [];
        for (let i = 0; i < value.length; i++) {
            let c = value[i]
            if (c >= '0' && c <= '9') {
                datas.push(parseInt(c));
            }
        }
        let sum = 0;
        datas.forEach((d) => {
            sum += d
        }, 0)
        let avg = sum * 1.0 / datas.length;
        let sum2 = 0;
        datas.forEach((data) => {
            sum2 += Math.pow(data - avg, 2);
        })
        let stddev = sum2 / datas.length;
        ctx.body = {
            code: 200,
            data: stddev != 0,
            message: 'success!'
        }
    }
    // 获取滑块位置
    async getSlidercaptchaXY(ctx) {
        const { body } = ctx.request;
        let getRandomNumberByRange = function (start, end) {
            return Math.round(Math.random() * (end - start) + start);
        };
        let width = body.width;
        let L = body.L;  // this.options.sliderL + this.options.sliderR * 2 + 3; // 滑块实际边长
        let sliderR = body.sliderR; // that.options.sliderR
        let height = body.height; // that.options.height
        // 随机生成的 x y 位置
        let x = getRandomNumberByRange(L + 10, width - (L + 10));
        let y = getRandomNumberByRange(10 + sliderR * 2, height - (L + 10));

        // 保存 x 方便下次校验
        setValue(body.id, x, 600);

        ctx.body = {
            code: 200,
            data: {
                x,
                y
            },
            message: 'success!'
        }
    }

    // 校验滑块
    async validSlidercaptcha(ctx) {
        const { body } = ctx.request;
        let val = await getValue(body.id)
        ctx.body = {
            code: 200,
            data: { spliced: true, verified: true },
            message: 'success~'
        }
    }
}

module.exports = new PublicController()
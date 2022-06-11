const nodemailer = require("nodemailer");

const config = require('./index');

const template = require('./emailTemplate')

const qs = require('qs');

// async..await is not allowed in global scope, must use a wrapper
async function send(sendInfo = {}) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    //   let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email", // 发件服务器
        host: "smtp.qq.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            // user: testAccount.user, // generated ethereal user
            //   pass: 'ahfygatujrtybfbi', // generated ethereal password

            user: '790143432@qq.com', // generated ethereal user
            pass: 'lqjrkrhiidvabedd', // generated ethereal password

        },
    });

    const route = sendInfo.type === 'email' ? '/confirm' : '/reset';
    // 跳转链接
    const url = `${config.baseUrl}/#${route}?` + qs.stringify(sendInfo.data)
    // 生成邮件模板字符
    let tmp = sendInfo.type == 'email' ? template.chageEmailTemplate({ url }) : template.retrievePwdTemplate({ url })
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"LuQuanLong" <790143432@qq.com>', // sender address
        to: sendInfo.email, // list of receivers
        // to: "729088225@qq.com",
        subject: "您好," + sendInfo.user, // Subject line
        text: "您的邀请码是" + sendInfo.code, // plain text body
        html: tmp, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// send().catch(console.error);

module.exports = send
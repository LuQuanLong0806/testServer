const nodemailer = require("nodemailer");

const config = require('./index');

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
      user: '790143432@qq.com', // generated ethereal user
      pass: 'lqjrkrhiidvabedd', // generated ethereal password
      //   pass: 'ahfygatujrtybfbi', // generated ethereal password

    },
  });

  //   let sendInfo = {
  //       code:'1234',
  //       expire: '2019-10-01',
  //       email: '790143432@qq.com',
  //       user: 'Lu'
  //   }

  const route = sendInfo.type === 'email' ? '/confirm' : '/reset'

  const qs = require('qs');
  const url = `${config.baseUrl}/#${route}?` + qs.stringify(sendInfo.data)

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"LuQuanLong" <790143432@qq.com>', // sender address
    to: sendInfo.email, // list of receivers
    // to: "729088225@qq.com",
    subject: "您好," + sendInfo.user, // Subject line
    text: "您的邀请码是" + sendInfo.code, // plain text body
    html: `<div style="width: 650px; box-shadow: 1px 1px 5px 1px #ececec;margin: 0 auto;">
        <div
          style="
            height: 60px;
            background-color: #0aa1ed;
          "
        >
          <span
            style="
              color: #fff;
              font-size: 24px;
              font-weight: 600;
              line-height: 60px;
              margin-left: 20px;
            "
          >
            Luql-我的社区
          </span>
        </div>
        <div style="padding: 20px; text-align: center">
          您正在修改绑定邮箱账号,请点击下方按钮前往修改!
          <div style="text-align: center;margin-top: 10px;">
            <a
              style="
                display: inline-block;
                padding: 10px 15px;
                background: #0aa1ed;
                color: #fff;
                border-radius: 5px;
              "
              href="${url}"
            >
              点击前往验证
            </a>
          </div>
          <span style="color: orange;margin-top: 10px;">如果不是本人操作请勿点击!</span>
        </div>
        <div
          style="
            background-color: #ececec;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #c6c6c6;
          "
        >
          系统邮件，请勿直接回复！
        </div>
      </div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// send().catch(console.error);

module.exports = send
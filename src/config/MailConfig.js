const nodemailer = require("nodemailer");

const config = require('./index');

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

  const route = sendInfo.type === 'email' ? '/email' : '/reset'

  const url = `${config.baseUrl}/#${route}?key=${sendInfo.key}`

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"LuQuanLong" <790143432@qq.com>', // sender address
    to: sendInfo.email, // list of receivers
    subject: "您好, 开发者" + sendInfo.user, // Subject line
    text: "您的邀请码是" + sendInfo.code, // plain text body
    html: "<b>Hello luquanl</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// send().catch(console.error);

module.exports = send
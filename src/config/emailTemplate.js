const chageEmailTemplate = (data = {}) => {
    return `<div style="width: 650px; box-shadow: 1px 1px 5px 1px #ececec;margin: 0 auto;">
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
          href="${data.url}"
        >
          点击前往验证
        </a>
      </div>
      <span style="color: orange;margin-top: 10px;">如果不是本人操作请勿点击！链接30分钟内有效!</span>
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
  </div>`
}


const retrievePwdTemplate = (data = {}) => {
    return `<div style="width: 650px; box-shadow: 1px 1px 5px 1px #ececec;margin: 0 auto;">
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
      您正在找回密码,请点击下方按钮前往重置密码!
      <div style="text-align: center;margin-top: 10px;">
        <a
          style="
            display: inline-block;
            padding: 10px 15px;
            background: #0aa1ed;
            color: #fff;
            border-radius: 5px;
          "
          href="${data.url}"
        >
          点击前往重置
        </a>
      </div>
      <span style="color: orange;margin-top: 10px;">如果不是本人操作请勿点击！链接30分钟内有效!</span>
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
  </div>`
}


module.exports = {
    chageEmailTemplate,
    retrievePwdTemplate
}
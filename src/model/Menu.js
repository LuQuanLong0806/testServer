


const mongoose = require('../config/DBHelper');

const Schema = mongoose.Schema;
// 定义数据类型
const MenuSchema = new Schema({
    title: { type: 'String', default: '' },
    path: { type: 'String', default: '' },
    component: { type: 'String', default: '' },
    hideInbread: { type: 'Boolean', default: false },
    hideInmenu: { type: 'Boolean', default: false },
    notCache: { type: 'Boolean', default: false },
    icon: { type: 'String', default: '' },
    sort: { type: 'String', default: '' },
    redirct: { type: 'String', default: '' },
    type: { type: 'String', default: '' },
    // 配合tree组件 展开对应的数据结构
    expand: { type: 'Boolean', default: true }
})

const OprationSchema = new Schema({
    name: { type: 'String', default: '' },
    type: { type: 'String', default: '' },
    method: { type: 'String', default: '' },
    path: { type: 'String', default: '' },
    regmark: { type: 'String', default: '' },
});
// mongo 嵌套子集
MenuSchema.add({
    children: [MenuSchema],
    oprations: [OprationSchema]
});

const Menus = mongoose.model('menus', MenuSchema)

module.exports = Menus
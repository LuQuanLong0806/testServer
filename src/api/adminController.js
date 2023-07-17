const Menu = require('./../model/Menu')

class AdminController {
    async getMenu(ctx) { }
    async addMenu(ctx) { 
        const {body} = ctx.request;
        const menu = new Menu(body);
        const result = await menu.save()
        ctx.body = {
            code: 200,
            data: result,
            message: 'success'
        }
    }
    async updateMenu(ctx) { }
    async deleteMenu(ctx) { }
}

module.exports = new AdminController()
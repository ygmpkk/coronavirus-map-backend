/**
 * 用户信息
 */

const Sequelize = require('sequelize');
const model = require('../lib/model')

class MyModel extends model{
    initModel(db) {
        return db.define(this.name, {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, comment: '用户唯一ID' },
            phone: { type: Sequelize.STRING, allowNull: false, comment: '手机号，唯一且不空' },
            sid: { type: Sequelize.STRING, allowNull: false, comment: 'session ID' },
        }, { timestamps: false })
    }
}
module.exports = new MyModel(__filename, true);

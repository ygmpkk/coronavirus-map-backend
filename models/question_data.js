/**
 * 用户提交问卷数据存储
 */

const Sequelize = require('sequelize');
const model = require('../lib/model')

class MyModel extends model{
    initModel(db) {
        return db.define(this.name, {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, comment: '问卷数据id' },
            paperid: { type: Sequelize.INTEGER, primaryKey: true, comment: '对应问卷id' },
            chooise: { type: Sequelize.TEXT, allowNull: false, comment: '选择的选项' },
            addtime: { type: Sequelize.BIGINT, allowNull: false, comment: '问卷创建时间' },
        }, { timestamps: false })
    }
}
module.exports = new MyModel(__filename, true);
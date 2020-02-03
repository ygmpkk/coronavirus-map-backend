/**
 * 问卷题目
 */

const Sequelize = require('sequelize');
const model = require('../lib/model')

class MyModel extends model{
    initModel(db) {
        return db.define(this.name, {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, comment: '问题id' },
            paperid: { type: Sequelize.INTEGER, primaryKey: true, comment: '对应问卷id' },
            seq: { type: Sequelize.INTEGER, comment: '问题序号' },
            title: { type: Sequelize.STRING, comment: '题目内容' },
            type: { type: Sequelize.STRING, allowNull: false, comment: '题目类型' },
            chooise: { type: Sequelize.TEXT, allowNull: false, comment: '题目选项' },
        }, { timestamps: false })
    }
}
module.exports = new MyModel(__filename, true);
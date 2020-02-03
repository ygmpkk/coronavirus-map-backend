/**
 * 问卷基本
 */

const Sequelize = require('sequelize');
const model = require('../lib/model')

class MyModel extends model{
    initModel(db) {
        return db.define(this.name, {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, comment: '问卷id' },
            title: { type: Sequelize.STRING, allowNull: false, comment: '问卷标题' },
            content: { type: Sequelize.STRING, allowNull: false, comment: '问卷介绍' },
            status: { type: Sequelize.INTEGER, allowNull: false, comment: '问卷状态 0草稿 1已发布 -1下架 -2删除(回收站) ' },
            addtime: { type: Sequelize.BIGINT, allowNull: false, comment: '问卷创建时间' },
        }, { timestamps: false })
    }
}
module.exports = new MyModel(__filename, true);
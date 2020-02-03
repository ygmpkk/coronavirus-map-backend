const path = require('path');
const logger = require('log4js').getLogger('db-model');
const { Op } = require('sequelize');
const assert = require('assert');

function transWhere(where) {
    let ret = {};
    for (let k in where) {
        if (typeof where[k] == 'object') {//如果是对象，那就认为是Op.xxx
            ret[k] = {};
            for (let m in where[k]) {
                console.info(m, Op[m], where[k][m]);
                ret[k][Op[m]] = where[k][m]
            }
        } else {
            ret[k] = where[k]
        }
    }
    return ret
}

class Model {

    //modelName可以是__filename，会自动把路径扩展名和
    constructor(modelName, ifcreate = false) {
        this.name = path.basename(modelName, '.js');
        this.ifcreate = ifcreate;
        if (ifcreate) {
            logger.warn(`table [${modelName}] is still using auto create, pls update /docs/init.sql to create table manualy and set ifcreate to false`)
        }
    }

    initModel() {//子类重载这个方法以建立模型
        throw new Error(`${this.name}:initModel not defined!`)
    }

    async init(db) {
        this.db = db;
        this.inst = this.initModel(db);
        if (this.ifcreate) await this.inst.sync()
    }


    async create(obj, validator) { return await this.inst.build(obj).save() }

    async set(id, props) {
        let obj = null;
        if (typeof id == 'number' || typeof id == 'string') {
            obj = await this.inst.findByPk(id);
        } else {
            obj = await this.inst.findOne(id);
        }
        assert(obj, `数据[${id}]未找到`);

        await obj.update(props);

        return obj
    }


    async find_one(id, raw = false) { return await this.inst.findByPk(id, { raw }) }

    async find_where(where, raw = false) {
        if (typeof where == 'number' || typeof where == 'string') {
            return this.find_one(where, raw)
        } else {
            return await this.inst.findOne({ where }, raw)
        }
    }

    async find_all(where = {}, { order = [['id', 'desc']], offset = 0, attributes = null, limit = 0, raw = false } = {}) {
        let paras = { where, order, offset, raw };
        if (attributes) paras.attributes = attributes;
        if (limit > 0) paras.limit = limit;

        return await this.inst.findAll(paras)
    }

    async delete(where) {
        await this.inst.destroy({ where }, { force: true })
    }


}

module.exports = Model;
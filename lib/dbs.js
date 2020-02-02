const path = require('path');
const assert = require('assert');
const logger = require('log4js').getLogger('dbsql');
const Sequelize = require('sequelize');
const buffer = require('./buffer');
const dbs = {};
const models = {};

const tables_nolog = ['onlines'];

exports.init = async function (defs, modelDir, modelused) {
    if (defs.defaults) {
        let def = defs.defaults;
        dbs.defaults = new Sequelize(def.name, def.user, def.pass, {
            host: def.host,
            port: def.port,
            dialect: def.dialect,
            pool: def.pool, timezone: '+08:00',
            logging: function (sql) {
                for (let str of tables_nolog) if (sql.indexOf(str) >= 0) return
                logger.info(sql)
            }
        })
    }

    if (!modelDir) return;
    for (let mname in modelused) {
        let { dbid, skiplog } = (typeof modelused[mname] == 'string') ? { skiplog: false, dbid: modelused[mname] } : modelused[mname];
        if (skiplog) tables_nolog.push('`' + mname + 's`');

        let modellist = buffer.get("models");
        modellist.push(mname)
        buffer.set("models",modellist)

        if (!dbs[dbid]) {
            if (defs.defaults) {
                dbs[dbid] = defs.defaults;
            } else {
                assert(defs[dbid], `database [${dbid}] (used by [${mname}]) not defined`);
                let def = defs[dbid];
                logger.info(`init db [${dbid}]`);
                dbs[dbid] = new Sequelize(def.name, def.user, def.pass, {
                    host: def.host,
                    port: def.port,
                    dialect: def.dialect,
                    pool: def.pool , timezone: '+08:00',
                    logging: function (sql) {
                        if (sql.toUpperCase().indexOf('SELECT') >= 0) return;
                        for (let str of tables_nolog) if (sql.indexOf(str) >= 0) return;
                        logger.info(sql)
                    }
                })
            }
        }
        await require(path.join(modelDir, mname)).init(dbs[dbid])
    }
};
exports.model = function (name) {
    return models[name]
};


const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const buffer = require('./buffer');
const fileio = require('./fileio');

const LOG4JS_DEFAULT = {
    appenders: {
        "console": { type: "stdout" },
        "sql": { type: "dateFile", maxLogSize: 10485760, backups: 1, absolute: true, pattern: "yyyyMMdd.log", alwaysIncludePattern: true },
        "app-log": { type: "dateFile", maxLogSize: 10485760, backups: 1, absolute: true, pattern: "yyyyMMdd.log", alwaysIncludePattern: true },
        "app-err": { type: "dateFile", maxLogSize: 10485760, backups: 1, absolute: true, pattern: "yyyyMMdd.err", alwaysIncludePattern: true },
        "logfilter": { type: "logLevelFilter", appender: "app-log", level: "info" },
        "errfilter": { type: "logLevelFilter", appender: "app-err", level: "error" },

    },
    categories: {
        "default": { "appenders": ["console", "logfilter", "errfilter"], "level": "info" },
        "sql": { "appenders": ["sql"], "level": "info" },
        "debug": { "appenders": ["console"], "level": "trace" }
    }
};
/**
 * 应用初始化：日志，log及数据库连接，不依赖任何业务模块
 */
exports.init = async function (approot, confile = {}, logdir = 'www') {

    for (let k in confile) if (!/^_/.test(k)) buffer.set(k, confile[k]);

    if (fs.existsSync(path.join(approot,'..', 'config'))) {

        let files = fileio.requires(path.join(approot, '..', 'config'));

        for (let name in files) buffer.set(name, files[name])

    }

    //所有相对目录转绝对目录
    let paths = buffer.get('paths');

    paths.approot = approot;

    paths.logroot = paths.logroot || '../logs';

    for (let k in paths) paths[k] = path.isAbsolute(paths[k]) ? paths[k] : path.join(approot, paths[k]);


    //log4js初始化
    let logconf = buffer.exists('logs') || LOG4JS_DEFAULT;

    for (let k in logconf.appenders) {
        if (logconf.appenders[k].type == 'dateFile' && !logconf.appenders[k].filename) {
            logconf.appenders[k].filename = path.join(paths.logroot, logdir, k)
        }
    }

    log4js.configure(logconf);

    let logger = log4js.getLogger('initor');

    logger.info('log4js......ok.');

    //数据库
    let models = await fileio.requires(paths.dbmodels);
    if (Object.keys(models).length) {
        for (let k in models) { models[k] = 'defaults' }
        await require('./dbs').init(buffer.get('dbs'), paths.dbmodels, models);
        logger.info('databases......ok', paths.dbmodels, buffer.get('models'))
    } else {
        logger.info('database......none.')
    }

};
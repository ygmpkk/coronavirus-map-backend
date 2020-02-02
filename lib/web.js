const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const log4js = require('log4js')
const https = require('https')
const logger = log4js.getLogger('httpd')
const app = express()

/**
 * web端口和根目录必须定义，其他默认
 */
exports.start = function (webroot, port, {routes = 'routes'} = {}) {

    //相对路径转绝对路径
    routes = path.isAbsolute(routes) ? routes : path.join(webroot, routes)

    require('./asyncErrors')//异步错误捕获

    app.use(log4js.connectLogger(logger, { format: ':remote-addr :method :url :status :response-time ms' }))

    app.use(bodyParser.json({ 'limit': '10000kb' }))
    app.use(bodyParser.urlencoded({ extended: false }))

    app.use('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,sid');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
        if (req.method == 'OPTIONS') {
            res.sendStatus(200)// 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
        } else {
            next()
        }
    })

    for (let fname of fs.readdirSync(routes)) {
        let stat = fs.statSync(path.join(routes, fname));
        if (stat.isDirectory()) {//如果是目录，同样处理一遍
            let subdir = path.join(routes, fname);
            for (let fp of fs.readdirSync(subdir)) {
                if (/^\.|^_/.test(fp) || !/\.js$/.test(fp)) continue;
                let file = require(path.join(subdir, fp));
                fp = path.basename(fp, '.js');
                app.use(fp == 'index' ? `/${fname}` : `/${fname}/${fp}`, file)
            }
        } else {
            if (/^\.|^_/.test(fname) || !/\.js$/.test(fname)) continue;

            let file = require(path.join(routes, fname));
            fname = path.basename(fname, '.js');
            app.use(fname == 'index' ? '/' : `/${fname}`, file)

        }
    }

    //404
    app.use(function (req, res, next) {
        if (req.url.endsWith('.map')) return next();
        let err = new Error(req.url + ' Not Found');
        err.status = 404;
        res.json({ status :{ code: (err.status || 404), msg: err.message }});
        next(err)
    });
    app.use(function (err, req, res, next) {
        logger.error(err);
        err.status = err.status || 500;
        res.json({ status :{ code: (err.status || 500), msg: err.message }})
        next(err)
    });

    app.set('port', port);
    let server = http.createServer(app);
    startServ(server, port);

    return server
};

function startServ(server, port) {
    server.listen(port, '0.0.0.0');
    server.on('error', function (error) {
        if (error.syscall !== 'listen') {
            throw error
        }
        switch (error.code) {
            case 'EACCES':
                logger.error('requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error('port is already in use');
                process.exit(1);
                break;
            default:
                throw error
        }
    });
    server.on('listening', function () {
        logger.info(`httpd started at ${port}`)
    })
}

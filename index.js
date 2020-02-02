const {initor, web, buffer } = require('./lib');
const config = require('./config/index');

initor.init(__dirname,require('./config')).then(async _ => {
    //应用服务初始化
    await require('./bin').init();
    //启动webserver
    web.start(__dirname, config.server.port)
});
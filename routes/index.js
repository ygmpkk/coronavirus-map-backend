const logger = require('log4js').getLogger('www-index');
const router = require('express').Router();
const { buffer } = require('../lib');

router.get('/', (req, res) => {
    let stat = { code:200, msg:"获取成功" };
    let data = { "wuhan":"加油"};
    res.json({status:stat, data:data})
});

module.exports = router;

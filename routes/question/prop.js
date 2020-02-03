const logger = require('log4js').getLogger('question-prop');
const assert = require('assert');
const router = require('express').Router();
const { buffer } = require('../../lib');

/**
 * 问卷数据分析
 */

router.post('/', (req, res) => {
    let stat = { code:200, msg:"获取成功" };
    let data = { "index":"prop"};
    res.json({status:stat, data:data})
});

module.exports = router;
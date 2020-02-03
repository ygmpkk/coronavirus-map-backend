const logger = require('log4js').getLogger('question-data');
const router = require('express').Router();
const { buffer } = require('../../lib');

/**
 * 已提交的问卷数据
 */

router.post('/', (req, res) => {
    let stat = { code:200, msg:"获取成功" };
    let data = { "index":"data"};
    res.json({status:stat, data:data})
});

module.exports = router;
const logger = require('log4js').getLogger('question-paper');
const router = require('express').Router();
const { buffer } = require('../..pap/lib');

/**
 * 问卷管理
 */

router.post('/', (req, res) => {
    let stat = { code:200, msg:"获取成功" };
    let data = { "index":"paper"};
    res.json({status:stat, data:data})
});

module.exports = router;
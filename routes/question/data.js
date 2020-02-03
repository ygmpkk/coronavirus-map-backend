const logger = require('log4js').getLogger('question-data');
const assert = require('assert');
const router = require('express').Router();
const { buffer } = require('../../lib');
const { question_datadb } = require('../../models');

/**
 * 已提交的问卷数据
 */

router.post('/', async (req, res) => {
    let obj = {paperid:3,chooise:JSON.stringify(["eeee","bb","aa"]),addtime:Date.now()};

    let abc = await question_datadb.create(obj);
    abc = abc.dataValues;
    logger.info(abc);
    let timestmp = Date.now();
    abc.addtime = timestmp;
    logger.info(await question_datadb.set(abc.id,abc));
    logger.info(await question_datadb.find_all());
    logger.info(await question_datadb.find_one(abc.id));
    logger.info(await question_datadb.find_where({addtime:timestmp}));
    logger.info(await question_datadb.set(abc.id,abc));
    logger.info(await question_datadb.delete({id:abc.id}));








    let stat = { code:200, msg:"获取成功" };
    let data = { "index":"data"};
    res.json({status:stat, data:data})
});

module.exports = router;
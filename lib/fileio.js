const fs = require('fs');
const path = require('path');

//require fpath目录下所有文件，如果有index.js需要跳过
exports.requires = function (fpath, { skip = /^\.|^_|^index.js$/, match = /\.js$|\.json$/ } = {}) {
    let ret = {};
    for (let file of fs.readdirSync(fpath)) {
        if (!match.test(file)) continue;
        if (skip.test(file)) continue;
        ret[path.parse(file).name] = require(path.join(fpath, file))
    }
    return ret
};
// 简易版缓存，主要用于config配置的加载及修改
const buffs = {}

exports.all = function(){
    return buffs
}
exports.get = function (name, defaults = {}) {
    if (!buffs[name]) buffs[name] = defaults
    return buffs[name]
}

exports.exists = function (name) {
    return buffs[name]
}

exports.set = function (name, obj) {
    buffs[name] = obj
    return buffs[name]
}
exports.keys = function () {
    return Object.keys(buffs)
}
exports.print = function (name) {
    if (name) console.info('name', buffs[name])
    else console.info(Object.keys(buffs))
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
var getType_1 = require("./getType");
var Storage = /** @class */ (function () {
    function Storage(type) {
        if (type === void 0) { type = 'localStorage'; }
        this.type = type;
        this.enableStorage = window && window[type] ? true : false;
    }
    Storage.prototype.set = function (key, value, expireDays) {
        if (expireDays === void 0) { expireDays = 7; }
        var bool = this.enableStorage;
        if (getType_1.getType(expireDays) !== 'number') {
            throw new Error('过期天数必须为数字');
        }
        if (bool) {
            try {
                var t = expireDays > 0 ? (new Date().getTime()) * 1 + (expireDays * 86400000) : 0;
                var v = JSON.stringify({ v: value, t: t });
                window[this.type].setItem(key, v);
            }
            catch (_a) {
                bool = false;
                console.error('数据json化失败，请检查待存储数据');
            }
        }
        return bool;
    };
    Storage.prototype.get = function (key) {
        var res = '';
        if (this.enableStorage) {
            try {
                var v = window[this.type].getItem(key) || '{"v":"","t":0}';
                var json = JSON.parse(v);
                var now = (new Date()).getTime();
                res = json.v;
                // 如果当前存在引擎为localStorage，并且当时时间大于过期时间，则移除数据
                if (this.type === 'localStorage' && (now > json.t)) {
                    res = '';
                    this.remove(key);
                }
            }
            catch (err) {
                console.error(err);
                console.error('数据错误');
            }
        }
        return res;
    };
    Storage.prototype.remove = function (key) {
        this.enableStorage && window[this.type].removeItem(key);
    };
    return Storage;
}());
exports.Storage = Storage;

/**
 * @axmine/helper v3.0.1
 * (c) 2019-2021 axmine https://github.com/axmine/helper.git
 * License: MIT
 * Released on: Aug 21, 2020
 */

var Cookie = /** @class */ (function () {
    function Cookie() {
        this.cookieEnabled = window && window.navigator.cookieEnabled;
    }
    /**
     * 向cookie存入数据
     * @param key 存储的键名
     * @param value 存储的值
     * @param expireDays 有效期(单位天,默认为7天）
     * @returns boolean，存入成功返回true, 否则false
     */
    Cookie.prototype.set = function (key, value, expireDays) {
        if (expireDays === void 0) { expireDays = 7; }
        var b = this.cookieEnabled;
        if (this.cookieEnabled) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expireDays);
            var expires = expireDays ? ";expires=" + exdate.toUTCString() : '';
            document.cookie = key + "=" + escape(value) + expires;
            b = this.get(key) === value;
        }
        return b;
    };
    /**
     * 从cookie取出数据
     * @param key 存储时的键名
     * @returns string，无相关存储时返回空字串
     */
    Cookie.prototype.get = function (key) {
        var res = '';
        if (this.cookieEnabled && document.cookie.length > 0) {
            var s = document.cookie.indexOf(key + '=');
            if (s >= 0) {
                s = s + key.length + 1;
                var e = document.cookie.indexOf(';', s);
                if (e === -1) {
                    e = document.cookie.length;
                }
                res = unescape(document.cookie.substring(s, e));
            }
        }
        return res;
    };
    /**
     * 删除存储在cookie中的数据
     * @param key 存储时的键名
     * @returns boolean, 成功true, 失败false
     */
    Cookie.prototype.remove = function (key) {
        var b = this.cookieEnabled;
        if (this.cookieEnabled && key) {
            b = this.set(key, '', -100);
        }
        return b;
    };
    return Cookie;
}());
var cookie = new Cookie();

function getType(data) {
    var str = Object.prototype.toString.call(data).slice(8, -1);
    return str.toLocaleLowerCase();
}

/**
 * 取两个数之间的随机数
 * @param min 最小范围
 * @param max 最大范围
 * @param type 确定返回类型为浮点数或整型
 * @returns number
 */
function random(min, max, result) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    if (result === void 0) { result = 'float'; }
    if (getType(min) !== 'number' || getType(max) !== 'number') {
        throw new Error('仅支持数字随机');
    }
    if (min > max) {
        throw new Error('请输入合理的随机范围');
    }
    var res = Math.random() * (max - min + 1) + min;
    if (result === 'int') {
        res = Math.floor(res);
    }
    return res;
}

var Storage = /** @class */ (function () {
    function Storage(type) {
        if (type === void 0) { type = 'localStorage'; }
        this.type = type;
        this.enableStorage = window && window[type] ? true : false;
    }
    Storage.prototype.set = function (key, value, expireDays) {
        if (expireDays === void 0) { expireDays = 7; }
        var bool = this.enableStorage;
        if (getType(expireDays) !== 'number') {
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
                var v = window[this.type].getItem(key) || "{\"v\":\"\",\"t\":0}";
                var json = JSON.parse(v);
                var now = new Date().getTime();
                res = json.v;
                // 如果当前存在引擎为localStorage，并且当时时间大于过期时间，则移除数据
                if (this.type === 'localStorage' && now > json.t) {
                    res = '';
                    this.remove(key);
                }
            }
            catch (_a) {
                console.error('数据错误');
            }
        }
        return res;
    };
    Storage.prototype.remove = function (key) {
        var bool = this.enableStorage;
        if (bool) {
            window[this.type].removeItem(key);
            bool = this.get(key) === '';
        }
        return bool;
    };
    return Storage;
}());

var Adate = /** @class */ (function () {
    function Adate() {
    }
    /**
     * 通过日期字符串返回时间戳 或 通过时间戳返回日期字符串
     * @param data 时间戳 或 日期字符串
     * @param format 当第一个参数为时间戳时，此参数才具有意义
     * @returns string | number
     */
    Adate.prototype.format = function (data, format) {
        if (format === void 0) { format = 'y-m-d h:i'; }
        switch (typeof data) {
            case 'number':
                return this.sec2date(data, format);
            case 'string':
                return this.date2sec(data);
            default:
                throw new Error('参数不合法');
        }
    };
    /**
     * 通过日期返回时间戳
     * @param date 日期
     * @returns 返回时间戳
     */
    Adate.prototype.date2sec = function (date) {
        try {
            var d = new Date(Date.parse(date.replace(/-/g, '/')));
            return Math.floor(d.getTime() / 1000);
        }
        catch (_a) {
            throw new Error('不是有效的日期格式');
        }
    };
    // 当数字不满 2 位时，前导用 0 填充
    Adate.prototype.zeroFill = function (n) { return n < 10 ? '0' + n : n.toString(); };
    /**
     * 秒时间戳转换为年月日时分秒周
     * @param seconds 秒数
     * @param format 格式化样式 如 y-m-d h:i:s，注W返回汉字， w返回数字，0为周日
     * @returns string 返回格式化后的数据，如 2012-02-24 23:59
     */
    Adate.prototype.sec2date = function (seconds, format) {
        var _this = this;
        if (format === void 0) { format = 'y-m-d h:i'; }
        var d = new Date(Math.floor(seconds * 1000));
        return format.replace(/\w/g, function (w) {
            var k = w !== 'w' ? w.toLowerCase() : w;
            var temp = {
                y: d.getFullYear(),
                m: _this.zeroFill(d.getMonth() + 1),
                d: _this.zeroFill(d.getDate()),
                h: _this.zeroFill(d.getHours()),
                i: _this.zeroFill(d.getMinutes()),
                s: _this.zeroFill(d.getSeconds()),
                w: d.getDay(),
                W: ['天', '一', '二', '三', '四', '五', '六'][d.getDay()]
            };
            return temp[k] || '';
        });
    };
    return Adate;
}());
var date = new Adate();

export { Storage, cookie, date, getType, random };

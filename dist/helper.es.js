/**
 * @axmine/helper v1.1.2
 * (c) 2019-2020 yocss https://github.com/yocss/axmine.git
 * License: MIT
 * Released on: Aug 21, 2020
 */

// format date
function formatDate(sec, format) {
    if (format === void 0) { format = 'y-m-d h:i'; }
    var d = new Date(sec * 1000);
    function expando(n) { return n < 10 ? '0' + n : n.toString(); }
    return format.replace(/\w/g, function (word) {
        var w = word.toLowerCase();
        return {
            y: d.getFullYear(),
            m: expando(d.getMonth() + 1),
            d: expando(d.getDate()),
            h: expando(d.getHours()),
            i: expando(d.getMinutes()),
            s: expando(d.getSeconds()),
            w: ['天', '一', '二', '三', '四', '五', '六'][d.getDay()]
        }[w] || '';
    });
}

// import { version } from '../package.json';
function getType(data) {
    return Object.prototype.toString.call(data).slice(8, -1).toLocaleLowerCase();
}

var Type;
(function (Type) {
    Type["localStorage"] = "localStorage";
    Type["sessionStorage"] = "sessionStorage";
    Type["cookie"] = "cookie";
})(Type || (Type = {}));
/**
 * store data
 */
var Store = /** @class */ (function () {
    function Store() {
    }
    Store.prototype.set = function (key, value, options) {
        if (options === void 0) { options = {}; }
        var option = Object.assign({ expireDays: 7, type: Type.localStorage }, options);
        var type = option.type;
        var expireDays = option.expireDays;
        return type === 'cookie' ? this.setCookie(key, value, expireDays) : this.setStorage(key, value, expireDays, type);
    };
    Store.prototype.get = function (key, type) {
        if (type === void 0) { type = Type.localStorage; }
        return type === 'cookie' ? this.getCookie(key) : this.getStorage(key, type);
    };
    Store.prototype.remove = function (key, type) {
        if (type === void 0) { type = Type.localStorage; }
        return type === 'cookie' ? this.removeCookie(key) : this.removeStorage(key, type);
    };
    Store.prototype.setStorage = function (key, value, expireDays, type) {
        if (expireDays === void 0) { expireDays = 7; }
        if (type === void 0) { type = Type.localStorage; }
        var bool = window && window[type] ? true : false;
        if (bool) {
            try {
                var t = expireDays > 0 ? (new Date().getTime()) * 1 + (expireDays * 86400000) : 0;
                var val = JSON.stringify({ v: value, t: t });
                window[type].setItem(key, val);
                bool = this.getStorage(key) === value;
            }
            catch (_a) {
                bool = false;
                console.error('数据格式化失败');
            }
        }
        return bool;
    };
    Store.prototype.getStorage = function (key, type) {
        if (type === void 0) { type = Type.localStorage; }
        var res = '';
        if (window && window[type]) {
            try {
                var v = window[type].getItem(key) || "{\"v\":\"\",\"t\":0}";
                var obj = JSON.parse(v);
                var now = new Date().getTime();
                res = obj.v;
                if (type === 'localStorage' && obj.t > 0 && now > obj.t) {
                    res = '';
                    this.removeStorage(key);
                }
            }
            catch (_a) {
                console.error('数据格式错误');
            }
        }
        return res;
    };
    Store.prototype.removeStorage = function (key, type) {
        if (type === void 0) { type = Type.localStorage; }
        var bool = window && window[type] ? true : false;
        if (bool) {
            window[type].removeItem(key);
            bool = this.getStorage(key) === '';
        }
        return bool;
    };
    Store.prototype.setCookie = function (key, value, expireDays) {
        if (expireDays === void 0) { expireDays = 7; }
        var bool = window && window.navigator.cookieEnabled;
        // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
        if (bool) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expireDays);
            var expires = expireDays ? ";expires=" + exdate.toUTCString() : '';
            document.cookie = key + "=" + escape(value) + expires;
            bool = this.getCookie(key) === value;
        }
        return bool;
    };
    Store.prototype.getCookie = function (key) {
        var bool = window && window.navigator.cookieEnabled;
        // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
        var res = '';
        if (bool) {
            if (document.cookie.length > 0) {
                var start = document.cookie.indexOf(key + '=');
                if (start >= 0) {
                    start = start + key.length + 1;
                    var end = document.cookie.indexOf(';', start);
                    if (end === -1)
                        end = document.cookie.length;
                    res = unescape(document.cookie.substring(start, end));
                }
            }
        }
        return res;
    };
    Store.prototype.removeCookie = function (key) {
        var bool = window && window.navigator.cookieEnabled;
        // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
        if (bool) {
            bool = this.getCookie(key) ? true : false;
            if (bool) {
                this.setCookie(key, '', -1);
            }
        }
        return bool;
    };
    return Store;
}());

var Type$1;
(function (Type) {
    Type["localStorage"] = "localStorage";
    Type["sessionStorage"] = "sessionStorage";
    Type["cookie"] = "cookie";
})(Type$1 || (Type$1 = {}));
/**
 * store data
 */
var Cookie = /** @class */ (function () {
    function Cookie(type) {
        if (type === void 0) { type = Type$1.localStorage; }
        this.type = type;
    }
    Cookie.prototype.set = function (key, value, expireDays) {
        if (expireDays === void 0) { expireDays = 7; }
        var type = this.type;
        return type === 'cookie' ? this.setCookie(key, value, expireDays) : this.setStorage(key, value, expireDays, type);
    };
    Cookie.prototype.get = function (key) {
        return this.type === 'cookie' ? this.getCookie(key) : this.getStorage(key, this.type);
    };
    Cookie.prototype.remove = function (key) {
        return this.type === 'cookie' ? this.removeCookie(key) : this.removeStorage(key, this.type);
    };
    Cookie.prototype.setStorage = function (key, value, expireDays, type) {
        if (expireDays === void 0) { expireDays = 7; }
        if (type === void 0) { type = Type$1.localStorage; }
        var bool = window && window[type] ? true : false;
        if (bool) {
            try {
                var t = expireDays > 0 ? (new Date().getTime()) * 1 + (expireDays * 86400000) : 0;
                var val = JSON.stringify({ v: value, t: t });
                window[type].setItem(key, val);
                bool = this.getStorage(key) === value;
            }
            catch (_a) {
                bool = false;
                console.error('数据格式化失败');
            }
        }
        return bool;
    };
    Cookie.prototype.getStorage = function (key, type) {
        if (type === void 0) { type = Type$1.localStorage; }
        var res = '';
        if (window && window[type]) {
            try {
                var v = window[type].getItem(key) || "{\"v\":\"\",\"t\":0}";
                var obj = JSON.parse(v);
                var now = new Date().getTime();
                res = obj.v;
                if (type === 'localStorage' && obj.t > 0 && now > obj.t) {
                    res = '';
                    this.removeStorage(key);
                }
            }
            catch (_a) {
                console.error('数据格式错误');
            }
        }
        return res;
    };
    Cookie.prototype.removeStorage = function (key, type) {
        if (type === void 0) { type = Type$1.localStorage; }
        var bool = window && window[type] ? true : false;
        if (bool) {
            window[type].removeItem(key);
            bool = this.getStorage(key) === '';
        }
        return bool;
    };
    Cookie.prototype.setCookie = function (key, value, expireDays) {
        if (expireDays === void 0) { expireDays = 7; }
        var bool = window && window.navigator.cookieEnabled;
        // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
        if (bool) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expireDays);
            var expires = expireDays ? ";expires=" + exdate.toUTCString() : '';
            document.cookie = key + "=" + escape(value) + expires;
            bool = this.getCookie(key) === value;
        }
        return bool;
    };
    Cookie.prototype.getCookie = function (key) {
        var bool = window && window.navigator.cookieEnabled;
        // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
        var res = '';
        if (bool) {
            if (document.cookie.length > 0) {
                var start = document.cookie.indexOf(key + '=');
                if (start >= 0) {
                    start = start + key.length + 1;
                    var end = document.cookie.indexOf(';', start);
                    if (end === -1)
                        end = document.cookie.length;
                    res = unescape(document.cookie.substring(start, end));
                }
            }
        }
        return res;
    };
    Cookie.prototype.removeCookie = function (key) {
        var bool = window && window.navigator.cookieEnabled;
        // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
        if (bool) {
            bool = this.getCookie(key) ? true : false;
            if (bool) {
                this.setCookie(key, '', -1);
            }
        }
        return bool;
    };
    return Cookie;
}());

var supRules = ['required', 'len', 'min', 'max', 'enum', 'type', 'pattern', 'validator'];
function validate(rules, form) {
    // 遍历校验规则
    var result = { status: true, infos: [] };
    Object.keys(rules).forEach(function (k) {
        // 校验规则 类型为 array
        var rule = [].concat(rules[k]);
        // 等待被校验的值
        var val = form[k];
        for (var i = 0; i < rule.length; i++) {
            // 逐条进行校验
            var res = validRule(rule[i], val);
            if (!res.status) {
                // res.key = k
                result.infos.push({ message: res.message, key: k });
                break;
            }
        }
    });
    result.status = result.infos.length < 1;
    return result;
}
function validRule(rule, val) {
    var res = { status: true, message: rule.message || '' };
    var keys = Object.keys(rule);
    var valType = getType(val);
    // 1. 检查字段是否为必检字段
    var isRequired = false;
    // 2. 如果是必检字段，则检查值是否为空
    var isNull = /^\s+$/.test(val) || ['', undefined, null].includes(val);
    // 是否必检
    if (keys.includes('required') && rule['required']) {
        res.status = !isNull;
        isRequired = rule['required'] === true;
    }
    // 字段值为空并且为非必检时，直接通过验证
    var pass = !isRequired && isNull;
    // 字段必检或字段值不为空的时候，继续执行其他检查
    if (!pass && res.status) {
        for (var i = 0; i < keys.length; i++) {
            var ruleVal = rule[keys[i]];
            // 确保是在支持的校验规则之内
            if (supRules.includes(keys[i])) {
                // 检查其他字段是否合规
                switch (keys[i]) {
                    case 'len': {
                        res.status = val.length === ruleVal * 1;
                        break;
                    }
                    case 'min': {
                        if (valType === 'number') {
                            res.status = val >= ruleVal;
                        }
                        else {
                            res.status = val.length >= ruleVal;
                        }
                        break;
                    }
                    case 'max': {
                        if (valType === 'number') {
                            res.status = val <= ruleVal;
                        }
                        else {
                            res.status = val.length <= ruleVal;
                        }
                        break;
                    }
                    case 'enum': {
                        res.status = ruleVal.includes(val);
                        break;
                    }
                    case 'type': {
                        res.status = ruleVal.toLowerCase() === valType;
                        break;
                    }
                    case 'pattern': {
                        var reg = new RegExp(ruleVal);
                        res.status = reg.test(val);
                        break;
                    }
                    case 'validator': {
                        if (getType(ruleVal) === 'function') {
                            res.status = ruleVal(val);
                        }
                        else {
                            throw new Error('validator 不是一个函数');
                        }
                        break;
                    }
                }
            }
            // 只要有一项检查不合格，则退出当前循环
            if (!res.status) {
                break;
            }
        }
    }
    return res;
}

// Math.random
var Num;
(function (Num) {
    Num["Float"] = "float";
    Num["Int"] = "int";
})(Num || (Num = {}));
function random(min, max, type) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    if (type === void 0) { type = Num.Float; }
    if (getType(min) !== 'number' || getType(max) !== 'number') {
        throw Error('min and max must be a number');
    }
    if (min > max) {
        throw Error('min or max is outside of its valid range.');
    }
    var res = Math.random() * (max - min + 1) + min;
    if (type === 'int') {
        res = Math.floor(res);
    }
    return res;
}

function camelCase(str) {
    if (getType(str) !== 'string') {
        throw Error('str must be string.');
    }
    var hasLetter = /[a-zA-Z]/.test(str);
    var res = hasLetter ? str.replace(/\-{1,}/g, '_') : str;
    if (hasLetter) {
        res = res.replace(/\_{1,}/, '_');
        res = res.indexOf('_') === 0 ? res.slice(1) : res;
        res = res.lastIndexOf('_') === res.length - 1 ? res.slice(0, -1) : res;
        var aStr = res.split('_');
        var len = aStr.length;
        if (len > 1) {
            var first = aStr[0].toLowerCase();
            var last = '';
            for (var i = 1; i < len; i++) {
                var temp = aStr[i].toLowerCase();
                if (temp.length > 1) {
                    var firstLetter = temp[0].toUpperCase();
                    temp = firstLetter + temp.slice(1);
                }
                last += temp;
            }
            res = first + last;
        }
    }
    return res;
}

function setStore(state, data) {
    var type = getType(data);
    if (!['array', 'object'].includes(type)) {
        throw new Error('data 类型不正确');
    }
    var arrs = [].concat(data);
    arrs.forEach(function (item) {
        var _a;
        var val = item;
        if (item['key'] !== undefined && item['value'] !== undefined) {
            val = (_a = {}, _a[item['key']] = item['value'], _a);
        }
        Object.keys(val).forEach(function (k) {
            if (getType(val[k]) === 'object') {
                Object.assign(state[k], val[k]);
            }
            else {
                state[k] === val[k];
            }
        });
    });
    return state;
}
// export default {
//   SET_STORE: (state: object, data: any) => {
//     const type = getType(data)
//     if (!['array', 'object'].includes(type)) {
//       throw new Error('data 类型不正确')
//     }
//     switch (type) {
//       case 'array':
//         data.forEach(val => {
//           setStore(state, val)
//         })
//         break
//       case 'object':
//         setStore(state, data)
//         break
//     }
//   }
// }

// time format
var index = {
    formatDate: formatDate,
    getType: getType,
    store: new Store(),
    cookie: Cookie,
    validate: validate,
    random: random,
    camelCase: camelCase,
    setStore: setStore
};

export default index;

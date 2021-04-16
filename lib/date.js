"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                break;
            case 'string':
                return this.date2sec(data);
                break;
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
exports.default = new Adate();

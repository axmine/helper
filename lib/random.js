"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
var getType_1 = require("./getType");
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
    if (getType_1.getType(min) !== 'number' || getType_1.getType(max) !== 'number') {
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
exports.random = random;

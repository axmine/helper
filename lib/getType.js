"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getType = void 0;
function getType(data) {
    var str = Object.prototype.toString.call(data).slice(8, -1);
    return str.toLocaleLowerCase();
}
exports.getType = getType;

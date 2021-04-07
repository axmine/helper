# @axmine/helper
### 个人项目辅助方法集

 [![NPM Version][npm-image]][npm-url] [![GitHub license](https://img.shields.io/github/license/Yocss/axmine)](https://github.com/Yocss/axmine/blob/master/LICENSE) [![size-image]][size-url]
<!-- [![NPM Downloads][downloads-image]][downloads-url] -->
[size-image]: https://badgen.net/bundlephobia/minzip/@axmine/helper
[size-url]: https://bundlephobia.com/result?p=@axmine/helper
[npm-image]: https://badgen.net/npm/v/@axmine/helper
[npm-url]: https://npmjs.org/package/@axmine/helper
[downloads-image]: https://badgen.net/npm/dt/@axmine/helper
[downloads-url]: https://www.npmjs.com/package/@axmine/helper


## 安装

```js
npm i @axmine/helper -S
```

### ES6
```js
// ts
import { cookie } from '@axmine/helper/lib/cookie';

// js
import helper from '@axmine/helper';
```
### CommonJS
```js
var helper = require('@axmine/helper');
```
### 直接引入
```js
<script src="helper.js"></script>
```
## 方法名 或 对象
名称|用途|说明|返回值
---|:-:|---|----
cookie.set(<br>&nbsp;&nbsp;&nbsp;&nbsp;key: string, <br>&nbsp;&nbsp;&nbsp;&nbsp;value: any, <br>&nbsp;&nbsp;&nbsp;&nbsp;expireDays: number<br>) | 存储cookie | expireDays单位为天数 | boolean
cookie.get(key: string) | 取出cookie | -- | boolean
cookie.remove(key: string) | 删除cookie | -- | boolean
new Storage(<br>type: &nbsp;&nbsp;&nbsp;&nbsp;'localStorage'\|'sessionStorage' = 'localStorage'<br>) | 同cookie的方法 | -- | 同上
random(<br>&nbsp;&nbsp;&nbsp;&nbsp;min: number = 0,<br>&nbsp;&nbsp;&nbsp;&nbsp;max: number = 1, <br>&nbsp;&nbsp;&nbsp;&nbsp;result: 'float'\|'int' = 'float'<br>) | 取随机数 | result为 int 时<br>只返回随机的整数 | number
getType(data:any) | 获取参数的类型 | -- | string
date.format(<br>&nbsp;&nbsp;&nbsp;&nbsp;data: number\|string,<br>&nbsp;&nbsp;&nbsp;&nbsp;format: string = 'y-m-d h:i'<br>) | 通过时间戳返回日期<br>或<br>通过日期返回时间戳 | data为数字时，必须为秒数，不支持毫秒<br>data为字符串时，必须为规范的日期字串<br> | string \| number


## 更新日志
2021.04.07:
1. 主要语言已转至typescript，用ts把要用的主要方法都重写了

## 开发说明
```bash
// 打包
npm run build

// 测试
npm run test
```

## License

MIT

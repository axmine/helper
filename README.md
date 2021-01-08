# @axmine/helper
### 自用的js方法收集

 [![NPM Version][npm-image]][npm-url] [![GitHub license](https://img.shields.io/github/license/Yocss/axmine)](https://github.com/Yocss/axmine/blob/master/LICENSE) [![size-image]][size-url]
<!-- [![NPM Downloads][downloads-image]][downloads-url] -->
[size-image]: https://badgen.net/bundlephobia/minzip/@axmine/helper
[size-url]: https://bundlephobia.com/result?p=@axmine/helper
[npm-image]: https://badgen.net/npm/v/@axmine/helper
[npm-url]: https://npmjs.org/package/@axmine/helper
[downloads-image]: https://badgen.net/npm/dt/@axmine/helper
[downloads-url]: https://www.npmjs.com/package/@axmine/helper


## 使用方式

```js
npm i @axmine/helper -S
```

### ES6
```js
import helper from '@axmine/helper'
helper.formatDate(111100000)
```
### CommonJS
```js
var helper = require('@axmine/helper');
helper.formatDate(111100000)
```
### 直接引入
```js
<script src="helper.min.js"></script>
  helper.formatDate(111100000)
```
## 方法或对象
名称|用途|参数说明|返回值
---|:-:|---|----
formatDate()|格式化时间戳|sec: number // 需要处理的时间戳<br>format?: string // 格式化后的样式 默认值: 'y-m-d h:i'|string
getType()|判断数据类型| data: any // 需要被判断的数据|string
validate()|表单数据验证| rule:object // { keyname: [{ required: true, message: '参数不能为空' }] }<br>form:object // { keyname: '我是大铁锅' }|object
random()|取任意两个数之间的随机数|min:number // 默认是0<br>max:number // 默认为1<br>type: string // 返回浮点数或整数，默认为float, 取值 'float' 或 'int'|number
camelCase()|将字符串改为驼峰格式|str:string // 要被转换的字符，当字符中存在字母时，字符串中的下划线和中横线都会被替换为空，并且将整个字符串并转换成驼峰样式|string
<s>store.set()</s>（请使用cookie对象代替）|往 localStorage、sessionStorage 或 cookie中存储数据|key: string // 键名<br>value: any // 要保存的值<br>options?: { expireDays?: 7, type?: 'localStorage' } // type可选值： 'localStorage, sessionStorage, cookie'|boolean
<s>store.get()</s>（请使用cookie对象代替）|取出数据|key: string // 要取出的键名<br>type?: 'localStorage' // type可选值： 'localStorage, sessionStorage, cookie'|string
<s>store.remove()</s>（请使用cookie对象代替）|删除数据|key: string // 要删除的键名<br>type?: 'localStorage' // type可选值： 'localStorage, sessionStorage, cookie'|boolean
cookie（类）|请先实例化再调用|const cookie = new cookie(type = 'localStorage')<br>默认: 'localStorage',可选值，sessionStorage | cookie|object
cookie.set()|将数据存入浏览器cookie或localStorage或sessionStorage中|key:string // 键<br>value:any //值<br>expireDays:number // 存储天数，默认为7，可省略|boolean
cookie.get()|将数据取出|key:string // 键|string
cookie.remove()|移除数据|key:string // 键|boolean

## validate()示例

```javascript
import { validate } from '@axmine/helper'
// validate(rule, form)
// rule: 校验规则，示例：{ 字段名：校验规则 }
// form: 被校验的表单：{ 字段名：值 }
// 校验规则示例： { required: true, message: '此项必填' }, message是报错信息，不可缺少。
/**
 * 完整的支持的校验规则：
 * required // 是否为必填
 * len // 长度
 * min  // 当值为数字类型时，表示最小值，否则表示最小长度
 * max  // 当值为数字类型时，表示最大值，否则表示最大长度
 * enum // 枚举，如：['a', 'b', 'c']， 表示值只能是a 或 b 或 c
 * type // 类型 如：'number', 表示值只能是数字，支持所有的js原始数据类型
 * pattern // 正则，如：/abc/， 表示值里包含abc则通过验证
 * validator // 自定义校验方法：如：validator: (val) => val > 100
 */
// 举例： 要验证一个密码，必填，长度6-18位之间
const rule = { password: { required: true, min: 6, max: 18, message: '密码不符合规范' } }
const form = { user: 'john', password: 'abcde' }
validate(rule, form) // { status: false, infos: [{ message: '密码不符合规范', key: 'password' }] }
// 或者 把验证条件分开写，这样可以得到更精确的报错信息
const rule = { password: [
  { required: true, message: '密码不能为空' },
  { min: 6, message: '密码必须大于或等于6位' },
  { max: 18, message: '密码长度不得大于18位' },
  ] }
const form = { user: 'john', password: 'abcde' }
validate(rule, form) // { status: false, infos: [{ message: '密码必须大于或等于6位', key: 'password' }] }
```

## store代码示例(即将弃用), 请改用cookie
```javascript
import { cookie } from '@axmine/helper'
const store = new cookie()
store.set('user', 'xiaoming', 7) // 将xiaoming存储在键名为user的对象里，有效期为7天
store.get('user') // 获取user的值
store.remove('user') // 移除user

// 以下方法已弃用，请使用上方的cooie类代替
import { store } from '@axmine/helper'
// 注： store.set() 方法第三个参数是 options = { expireDays: 7 type: 'localStorage' }
store.set('user': 'john') // return: true // 默认 7 天有效
store.get('user') // return: 'john'
store.remove('user') // return: true
store.set('token': 'abad123lkdfivailkolq90912', { type: 'sessionStorage' }) // return: true
store.get('token', type: 'sessionStorage') // return: 'abad123lkdfivailkolq90912'
store.remove('token', type: 'sessionStorage') // return: true
store.set('token': 'abad123lkdfivailkolq90912', { type: 'cookie' }) // return: true  默认七天有效
store.get('token', type: 'cookie') // return: 'abad123lkdfivailkolq90912'
store.remove('token', type: 'cookie') // return: true
```

## Change log

2020.09.23:
1. Add function: random(min:number, max:number, [type = 'float']) // 取任意两个数之间的随机数
2. Add function: camelCase(str: string) // 将字符串转换成驼峰样式

## 开发说明
```bash
// 打包
npm run build

// 测试
npm run test
```

## License

MIT

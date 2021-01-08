import { getType } from './getType'

interface R {
  required?: boolean
  len?: number
  min?: number
  max?: number
  enum?: Array<string>
  type?: string
  pattern?: string
  validator?: Function
  message: string
}
interface Rule {
  [key: string]: Array<R> | R
}
interface Form {
  [key: string]: any
}
interface Result {
  status?: boolean
  message: string
  key?: string
}
interface ValidateRes {
  status: boolean,
  infos: Array<Result>
}
const supRules = ['required', 'len', 'min', 'max', 'enum', 'type', 'pattern', 'validator']
export function validate(rules: Rule, form: Form ): ValidateRes {
  // 遍历校验规则
  const result: ValidateRes = { status: true, infos: [] }
  Object.keys(rules).forEach(k => {
    // 校验规则 类型为 array
    const rule = [].concat(rules[k])
    // 等待被校验的值
    const val = form[k]
    for (let i = 0; i < rule.length; i++) {
      // 逐条进行校验
      const res = validRule(rule[i], val)
      if (!res.status) {
        // res.key = k
        result.infos.push({ message: res.message, key: k })
        break
      }
    }
  })
  result.status = result.infos.length < 1
  return result
}

function validRule(rule: R, val: any): Result {
  const res = { status: true, message: rule.message || '' }
  const keys = Object.keys(rule)
  const valType = getType(val)
  // 1. 检查字段是否为必检字段
  let isRequired = false
  // 2. 如果是必检字段，则检查值是否为空
  const isNull = /^\s+$/.test(val) || ['', undefined, null].includes(val)
  // 是否必检
  if (keys.includes('required') && rule['required']) {
    res.status = !isNull
    isRequired = rule['required'] === true
  }
  // 字段值为空并且为非必检时，直接通过验证
  const pass = !isRequired && isNull
  // 字段必检或字段值不为空的时候，继续执行其他检查
  if (!pass && res.status) {
    for (let i = 0; i < keys.length; i++) {
      const ruleVal = rule[keys[i]]
      // 确保是在支持的校验规则之内
      if (supRules.includes(keys[i])) {
        // 检查其他字段是否合规
        switch (keys[i]) {
          case 'len': {
            res.status = val.length === ruleVal * 1
            break
          }
          case 'min': {
            if (valType === 'number') {
              res.status = val >= ruleVal
            } else {
              res.status = val.length >= ruleVal
            }
            break
          }
          case 'max': {
            if (valType === 'number') {
              res.status = val <= ruleVal
            } else {
              res.status = val.length <= ruleVal
            }
            break
          }
          case 'enum': {
            res.status = ruleVal.includes(val)
            break
          }
          case 'type': {
            res.status = ruleVal.toLowerCase() === valType
            break
          }
          case 'pattern': {
            const reg = new RegExp(ruleVal)
            res.status = reg.test(val)
            break
          }
          case 'validator': {
            if (getType(ruleVal) === 'function') {
              res.status = ruleVal(val)
            } else {
              throw new Error('validator 不是一个函数')
            }
            break
          }
        }
      }
      // 只要有一项检查不合格，则退出当前循环
      if (!res.status) { break }
    }
  }
  return res
}
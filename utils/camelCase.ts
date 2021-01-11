import { getType } from './getType'

export function camelCase (str: string): string {
  if (getType(str) !== 'string') {
    throw Error('str must be string.')
  }
  const hasLetter = /[a-zA-Z]/.test(str)
  let res = hasLetter ? str.replace(/\-{1,}/g, '_') : str
  if (hasLetter) {
    res = res.replace(/\_{1,}/, '_')
    res = res.indexOf('_') === 0 ? res.slice(1) : res
    res = res.lastIndexOf('_') === res.length - 1 ? res.slice(0, -1) : res
    const aStr = res.split('_')
    const len = aStr.length
    if (len > 1) {
      const first = aStr[0].toLowerCase()
      let last = ''
      for (let i = 1; i < len; i++) {
        let temp = aStr[i].toLowerCase()
        if (temp.length > 1) {
          const firstLetter = temp[0].toUpperCase()
          temp = firstLetter + temp.slice(1)
        }
        last += temp
      }
      res = first + last
    }
  }
  return res
}
// Math.random
import { getType } from './getType'
enum Num {
  Float = 'float',
  Int = 'int'
}
export function random (min: number = 0, max: number = 1, type: Num  = Num.Float): number {
  if (getType(min) !== 'number' || getType(max) !== 'number') {
    throw Error('min and max must be a number')
  }
  if (min > max) {
    throw Error('min or max is outside of its valid range.')
  }
  let res = Math.random() * (max - min + 1) + min
  if (type === 'int') { res = Math.floor(res) }
  return res
}

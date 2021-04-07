import { getType } from './getType'
/**
 * 取两个数之间的随机数
 * @param min 最小范围
 * @param max 最大范围
 * @param type 确定返回类型为浮点数或整型
 * @returns number
 */
export function random (min: number = 0, max: number = 1, result: 'float'|'int' = 'float'): number {
  if (getType(min) !== 'number' || getType(max) !== 'number') {
    throw new Error('仅支持数字随机');
  }
  if (min > max) { throw new Error('请输入合理的随机范围'); }
  let res = Math.random() * (max - min + 1) + min;
  if (result === 'int') { res = Math.floor(res); }
  return res;
}

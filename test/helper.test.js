const helper = require('../dist/helper');

test('Test date.forma(1597913081): should be \'2020-08-20 16:44\'', () => {
  expect(helper.date.format(1597913081)).toBe('2020-08-20 16:44')
})
test('Test date.format(1597913081, \'y年m月d日 h:i:s\'): should be \'2020年08月20日 16:44:41\'', () => {
  expect(helper.date.format(1597913081, 'y年m月d日 h:i:s')).toBe('2020年08月20日 16:44:41')
})
test('Test date.format(\'2020-08-20 16:44:41\'): should be 1597913081', () => {
  expect(helper.date.format('2020-08-20 16:44:41')).toBe(1597913081)
})
test('Test date.format(\'2020/08/20 16:44:41\'): should be 1597913081', () => {
  expect(helper.date.format('2020/08/20 16:44:41')).toBe(1597913081)
})
test('Test getType({a: 1}): should be \'object\'', () => {
  expect(helper.getType({a: 1})).toBe('object')
})
test('Test getType([1,2]): should be \'array\'', () => {
  expect(helper.getType([1,2])).toBe('array')
})
test('Test getType(true): should be \'boolean\'', () => {
  expect(helper.getType(true)).toBe('boolean')
})
test('Test getType(() => {}): should be \'function\'', () => {
  expect(helper.getType(() => {})).toBe('function')
})


test('Test random(min: number, max: number, type: \'int\')', () => {
  expect(helper.random(2, 2, 'int')).toBe(2)
})
test('Test random(2, 200)', () => {
  const num = helper.random(2, 200)
  expect(num >= 2 && num < 200).toBe(true)
  const n = helper.random(2, 200, 'int')
  expect(Math.floor(n) === n).toBe(true)
})
test('Test random()', () => {
  const n = helper.random()
  expect(helper.getType(n)).toBe('number')
})

import helper from '../dist/helper'

// test formatDate()
test('Test formatDate(1597913081): should be \'2020-08-20 16:44\'', () => {
  expect(helper.formatDate(1597913081)).toBe('2020-08-20 16:44')
})
test('Test formatDate(1597913081, \'y年m月d日 h:i:s\'): should be \'2020年08月20日 16:44:41\'', () => {
  expect(helper.formatDate(1597913081, 'y年m月d日 h:i:s')).toBe('2020年08月20日 16:44:41')
})

// test getType()
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

// test store
// const store = helper.store
// test('Test store.set()', () => {
//   expect(store.set('key1', 111).toBe(false))
// })

// test validate
const args = [
  {
    name: 'Test validate required',
    rules: { a: { required: true, message: '不能为空' } },
    form: { a: '' },
    res: {
      status: false,
      infos: [
        { message: '不能为空', key: 'a' }
      ]
    }
  },
  {
    name: 'Test validate string\'s len',
    rules: { a: { len: 3, message: '字符长度必须为3' } },
    form: { a: '1' },
    res: {
      status: false,
      infos: [
        { message: '字符长度必须为3', key: 'a' }
      ]
    }
  },
  {
    name: 'Test validate array\'s len',
    rules: { a: { len: 3, message: '数组长度必须为3' } },
    form: { a: [1,2] },
    res: {
      status: false,
      infos: [
        { message: '数组长度必须为3', key: 'a' }
      ]
    }
  },
  {
    name: 'Test validate number: min and max 1',
    rules: { a: { min: 3, max: 10, message: '3 <= a <= 10' } },
    form: { a: 2 },
    res: {
      status: false,
      infos: [
        { message: '3 <= a <= 10', key: 'a' }
      ]
    }
  },
  {
    name: 'Test validate number: min and max 2',
    rules: { a: { min: 3, max: 10, message: '3 <= a <= 10' } },
    form: { a: 7 },
    res: {
      status: true,
      infos: []
    }
  },
  {
    name: 'Test validate !number: min and max 1',
    rules: { a: { min: 3, max: 10, message: '长度介于3-10位' } },
    form: { a: '2' },
    res: {
      status: false,
      infos: [
        { message: '长度介于3-10位', key: 'a' }
      ]
    }
  },
  {
    name: 'Test validate !number: min and max 2',
    rules: { a: { min: 3, max: 10, message: '长度介于3-10位' } },
    form: { a: [1,2,3,4] },
    res: {
      status: true,
      infos: []
    }
  },
  {
    name: 'Test validate enum 1',
    rules: { a: { enum: ['aa', 'bb', 'cc'], message: '3 <= a <= 10' } },
    form: { a: 'ab' },
    res: {
      status: false,
      infos: [
        { message: '3 <= a <= 10', key: 'a' }
      ]
    }
  },
  {
    name: 'Test validate enum 2',
    rules: { a: { enum: ['aa', 'bb', 'cc'], message: '3 <= a <= 10' } },
    form: { a: 'aa' },
    res: {
      status: true,
      infos: []
    }
  },
  {
    name: 'Test validate type 1',
    rules: { a: { type: 'number', message: '3 <= a <= 10' } },
    form: { a: 1 },
    res: {
      status: true,
      infos: []
    }
  },
  {
    name: 'Test validate type 2',
    rules: { a: { type: 'number', message: 'must be number' } },
    form: { a: '1' },
    res: {
        status: false,
        infos: [{ message: 'must be number', key: 'a' }]
    }
  },
  {
    name: 'Test validate reg 1',
    rules: { a: { pattern: /abc/i, message: 'error' } },
    form: { a: 'abCde' },
    res: {
        status: true,
        infos: []
    }
  },
  {
    name: 'Test validate reg 2',
    rules: { a: { pattern: /abc/, message: 'error' } },
    form: { a: 'adcde' },
    res: {
        status: false,
        infos: [{ message: 'error', key: 'a' }]
    }
  },
  {
    name: 'Test validate reg 3',
    rules: { a: { pattern: /^\d+$/, message: 'error' } },
    form: { a: '123' },
    res: {
        status: true,
        infos: []
    }
  },
  {
    name: 'Test validate validator',
    rules: { a: { validator: v => v > 10, message: 'error' } },
    form: { a: '123' },
    res: {
        status: true,
        infos: []
    }
  },
  {
    name: 'Test validate mix',
    rules: { pass: { min: 6, required: true, max: 18, message: 'error' } },
    form: { pass: 'abc123' },
    res: {
        status: true,
        infos: []
    }
  },
]
for (let i = 0; i < args.length; i++) {
  test(args[i].name || `Test validate() ${i}`, () => {
    expect(helper.validate(args[i].rules, args[i].form)).toEqual(args[i].res)
  })
}

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

test('Test camelCase(\'abc\')', () => {
  expect(helper.camelCase('abc')).toBe('abc')
})
test('Test camelCase(\'_abc\')', () => {
  expect(helper.camelCase('_abc')).toBe('abc')
})
test('Test camelCase(\'_abc_\')', () => {
  expect(helper.camelCase('_abc_')).toBe('abc')
})
test('Test camelCase(\'__abc_\')', () => {
  expect(helper.camelCase('__abc_')).toBe('abc')
})
test('Test camelCase(\'__abc_def\')', () => {
  expect(helper.camelCase('__abc_def')).toBe('abcDef')
})
test('Test camelCase(\'__abc_---def\')', () => {
  expect(helper.camelCase('__abc_---def')).toBe('abcDef')
})
test('Test camelCase(\'__abc_--__def\')', () => {
  expect(helper.camelCase('__abc_--__def')).toBe('abcDef')
})
test('Test camelCase(\'__a_d\')', () => {
  expect(helper.camelCase('__a_d')).toBe('ad')
})
test('Test camelCase(\'__a_d__ef_\')', () => {
  expect(helper.camelCase('__a_d__ef_')).toBe('adEf')
})

// test('Test vuex.mutations.SET_STORE', () => {
//   // expect(helper.vuex.mutations.SET_STORE({}, { key: 'haha' })).toEqual({key: 'haha'})
//   const data = {key: 'abc'}
//   console.log(helper.vuex.mutations.SET_STORE(data, { key: 'haha' }))
//   expect(helper.vuex.mutations.SET_STORE(data, { key: 'haha' })).toEqual({
//     key: 'haha'
//   })
// })
import { getType } from './getType'
export function setStore (state: object, data: any) {
  const type = getType(data)
  if (!['array', 'object'].includes(type)) {
    throw new Error('data 类型不正确')
  }
  const arrs = [].concat(data)
  arrs.forEach(item => {
    let val = item
    if (item['key'] !== undefined && item['value'] !== undefined) {
      val = { [item['key']]: item['value'] }
    }
    Object.keys(val).forEach(k => {
      if (getType(val[k]) === 'object') {
        Object.assign(state[k], val[k])
      } else {
        state[k] === val[k]
      }
    })
  })
  return state
}

// export default {
//   SET_STORE: (state: object, data: any) => {
//     const type = getType(data)
//     if (!['array', 'object'].includes(type)) {
//       throw new Error('data 类型不正确')
//     }
//     switch (type) {
//       case 'array':
//         data.forEach(val => {
//           setStore(state, val)
//         })
//         break
//       case 'object':
//         setStore(state, data)
//         break
//     }
//   }
// }
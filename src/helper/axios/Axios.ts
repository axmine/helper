import axios, { AxiosInstance } from 'axios'
import Qs from 'qs'
import { TInitOption, TTransformData, TResultData, TFormatKeys } from './Axios.dto'
// 初始化数据
import { initOption } from './initData'

export default class Axios {
  private http: AxiosInstance // http
  private init: TInitOption // 初始化参数
  // private formatKeys: TFormatKeys

  constructor (initConfig = initOption) {
    this.init = Object.assign(initOption, initConfig)

    this.http = axios.create({
      baseURL: this.init.baseURL,
      timeout: this.init.timeout,
      transformRequest: this.init.jsonData ? [(data: JSON) => { return Qs.stringify(data) }] : []
    })
    this.setInterceptor
  }

  // 定义拦截器
  private setInterceptor () {
    // 1. 请求拦截
    this.http.interceptors.request.use((config) => {

      return config
    }, (error) => {
      return Promise.reject(error)
    })

    // 2. 响应拦截
    this.http.interceptors.response.use(
      (response) => {
        response.data = this.transformResponseData(response, TTransformData.SUCCESS)
        return response
      },
      (error) => {
        const response = error.response
        const data = { statusCode: 500, code: -1, result: {}, message: ''}
        if (response) {
          Object.assign(data, this.transformResponseData(response, TTransformData.ERROR))
        } else {
          const statusCode = JSON.stringify(error).indexOf('timeout of') > -1 ? 600 : 504
          Object.assign(data, { statusCode, message: this.init.errorMessage[statusCode] })
        }
        return Promise.reject(data)
      }
    )
  }

  // 判断数据类型
  private getDataType (v:any): string {
    const t = Object.prototype.toString.call(v)
    return t.slice(8, -1).toLocaleLowerCase()
  }

  // 转换响应数据
  private transformResponseData (response: any, type: TTransformData): TResultData{
    const statusCode = response?.status || 700
    const res = { statusCode, code: -1, result: {}, message: 'ok'}
    const { data } = response
    if (this.getDataType(data) === 'object') {
      const result = response.data[this.init.formatKeys.result] || {}
      let code = response.data[this.init.formatKeys.code]
      code = isNaN(code) ? -1 : code * 1
      let message = response.data[this.init.formatKeys.message] || ''
      if (type === 'error') {
        code = this.init.errorMessage[code] ? code : 700
        message = message || this.init.errorMessage[code] || '请求发生错误，请联系工程师' + `(${statusCode})`
      }
      Object.assign(res, { statusCode, code, result, message })
    } else {
      Object.assign(res, { message: `响应错误，未获取预期数据(${statusCode})` })
    }
    return res
  }
}
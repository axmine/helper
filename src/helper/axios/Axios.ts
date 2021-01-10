import axios, { AxiosInstance } from 'axios'
import Qs from 'qs'
import { TInitOption, TTransformData, TResultData, TRequestConfigMethod, TRequestConfig } from './Axios.dto'
// 初始化数据
import { initOption } from './initData'

export default class Axios {
  private http: AxiosInstance // http
  private init: TInitOption // 初始化参数
  // private formatKeys: TFormatKeys
  private resultData: TResultData = {
    statusCode: 500,
    code: -1,
    result: {},
    message: ''
  }

  constructor (initConfig = initOption) {
    this.init = Object.assign(initOption, initConfig)

    this.http = axios.create({
      baseURL: this.init.baseURL,
      timeout: this.init.timeout,
      transformRequest: this.init.jsonData ? [(data: JSON) => { return Qs.stringify(data) }] : []
    })
    this.setInterceptor
  }

  private getResultData () {
    return this.resultData
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
      // 处理正常响应
        response.data = this.transformResponseData(response, TTransformData.SUCCESS)
        return response
      },
      (error) => {
      // 处理http状态码级别的错误
        const response = error.response
        const data = this.getResultData()
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

  // 转换响应数据格式
  private transformResponseData (response: any, type: TTransformData): TResultData{
    let statusCode = response?.status || 700
    const initResult = this.getResultData()
    const res = Object.assign(initResult, { statusCode })
    const { data } = response
    // 1. 处理后端按规范返回的数据
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
    // 2. 后端返回的数据不规范，将 statusCode 定义为 500
      statusCode = 500
      Object.assign(res, { statusCode, message: `响应错误，未获取预期数据(${statusCode})` })
    }
    return res
  }

  // 调用axios请求方法 并 返回统一的数据格式
  private async callRequest (url: string, data: JSON, config: TRequestConfig) :Promise<TResultData> {
    const res = this.getResultData()
    const post = ['post', 'put', 'patch']
    const m = post.concat(['get', 'delete', 'head', 'options'])
    const method :TRequestConfigMethod = m.includes(config.method) ? TRequestConfigMethod[config.method.toUpperCase()] : TRequestConfigMethod.GET
    const d = post.includes(method) ? { data } : { params: data }
    const query = Object.assign(d, config.option || {})
    try {
      const response = await this.http({ url, method, ...query })
      return Object.assign(res, response.data)
    } catch (error) {
      return error
    }
  }

  // 发起请求
  async request (url: string, data: JSON, config?: TRequestConfig) :Promise<TResultData> {
    const conf: TRequestConfig = Object.assign({
      method: 'get',
      option: {},
      showNotify: false, // 是否显示notify
      reTry: this.init.reTry // 请求失败重试次数
    }, config)
    const result = await this.callRequest(url, data, conf)

    return result
  }
}
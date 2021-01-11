/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import * as Qs from 'qs'
export interface JsonType { [key: string]: any }
export interface ErrorMessageType { [key: number]: string }
export interface CustomCodeType {
  success: Array<number>;
  [key: string]: Array<number>;
}
export interface FormatKeysType {
  code: string;
  result: string;
  message: string;
}
export interface OptionType {
  timeout?: number;
  baseURL?: string;
  jsonData?: boolean;
  formatKeys?: FormatKeysType;
  customCode?: CustomCodeType;
  errorMessage?: ErrorMessageType;
}
export interface ResultType {
  statusCode: number; // http状态码
  code: number; // 服务端自定义状态码
  result: any; // 结果项
  message: string; // 信息
}
export interface ConfigOptionType {
  baseURL?: string;
  timeout?: number;
  headers?: JsonType;
  [key: string]: any;
}
export interface ConfigType {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';
  option?: ConfigOptionType;
  [key: string]: any;
}

export class Axios {
  private http: AxiosInstance // http

  // 返回结果
  private resultData: ResultType = {
    statusCode: 500,
    code: -1,
    result: {},
    message: ''
  }

  // 初始化参数
  private init: OptionType = {
    timeout: 1000,
    baseURL: '/',
    jsonData: true,
    formatKeys: {
      code: 'code',
      result: 'result',
      message: 'message'
    } as FormatKeysType,
    errorMessage: {
      400: '请求发生错误，请联系工程师（400）',
      401: '登陆信息失效，请重新登录（401）', // token无效，需要登录
      402: '您的登录信息已过期（402）', // token过期，请求刷新token
      403: '你没有足够的权限访问该资源（403）', // token权限不足，访问被禁止
      404: '程序君找不到要请求的资源（404）',
      405: '服务器拒绝了你的请求（405）', // 禁用请求中指定的方法
      500: '请求错误，请联系工程师（500）', // 服务器遇到错误，无法完成请求
      501: '请求异常，请联系工程师（501）', // 服务器不具备完成请求的功能
      502: '数据异常，请联系工程师（502）', // 从服务器收到无效的响应
      503: '服务繁忙，请稍候再试（503）', // 服务器超载或停机维护，暂时状态
      504: '连接超时，请稍候再试（504）', // 未接收到服务器的响应
      505: '不受支持的请求，请联系工程师（505）' // http版本不受支持
    } as ErrorMessageType,
    customCode: {
      success: [0, 2000, 2010, 2040]
    } as CustomCodeType
  }

  constructor (option?: OptionType) {
    Object.assign(this.init, option)
    const config = this.init.jsonData ? {} : {
      transformRequest: [(data: JsonType) => { return Qs.stringify(data) }]
    }
    this.http = axios.create(Object.assign({
      baseURL: this.init.baseURL,
      timeout: this.init.timeout
    }, config))
    this.setInterceptor()
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
        response.data = this.transformResponseData(response, 'success')
        return response
      },
      (error) => {
      // 处理http状态码级别的错误
        const response = error.response
        const data = this.getResultData()
        if (response) {
          Object.assign(data, this.transformResponseData(response, 'error'))
        } else {
          const errorText = JSON.stringify(error)
          console.log('==== <Response error> ====')
          console.error(errorText)
          console.log('==== </Response error> ====')
          const statusCode = errorText.indexOf('timeout of') > -1 ? 504 : 502
          // this.init.errorMessage
          const errorMessage = this.init?.errorMessage || {}
          Object.assign(data, { statusCode, message: errorMessage[statusCode] })
        }
        return Promise.reject(data)
      }
    )
  }

  // 判断数据类型
  private getDataType (v: any): string {
    return Object.prototype.toString.call(v).slice(8, -1).toLowerCase()
  }

  // 转换响应数据格式
  private transformResponseData (response: any, type: string): ResultType {
    let statusCode = response?.status || 500
    const initResult = this.getResultData()
    const res = Object.assign(initResult, { statusCode })
    const { data } = response
    // 1. 处理后端按规范返回的数据
    if (this.getDataType(data) === 'object') {
      const formatKeys = this.init?.formatKeys || {
        code: 'code',
        result: 'result',
        message: 'message'
      }
      const result = response.data[formatKeys.result] || {}
      let code = response.data[formatKeys.code]
      code = isNaN(code) ? -1 : code * 1
      let message = response.data[formatKeys.message] || ''
      if (type === 'error') {
        const errorMessage = this.init?.errorMessage || {}
        code = errorMessage[code] ? code : 500
        message = message || errorMessage[code] || '请求发生错误，请联系工程师' + `(${statusCode})`
      }
      Object.assign(res, { statusCode, code, result, message })
    } else {
    // 2. 后端返回的数据不规范，将 statusCode 定义为 500
      statusCode = 502
      Object.assign(res, { statusCode, message: `响应错误，未获取预期数据(${statusCode})` })
    }
    return res
  }

  // 调用axios请求方法 并 返回统一的数据格式
  private async callRequest (url: string, data: JsonType, config: ConfigType): Promise<ResultType> {
    const res = this.getResultData()
    const post = ['post', 'put', 'patch']
    const mArrs = post.concat(['get', 'delete', 'head', 'options'])
    const confMethod = config?.method || 'get'
    const method = mArrs.includes(confMethod) ? confMethod : 'get'
    const query = post.includes(method) ? { data } : { params: data }
    try {
      const response = await this.http({ url, method, ...Object.assign(query, config.option) })
      return Object.assign(res, response.data)
    } catch (error) {
      return error
    }
  }

  // 发起请求
  /**
   * 发起ajax请求
   * @param url 请求的url地址
   * @param data 请求体参数
   * @param config 请求参数配置
   */
  async request (url: string, data: JsonType, config?: ConfigType): Promise<ResultType> {
    const conf: ConfigType = Object.assign({ method: 'get', option: {} }, config)
    const result = await this.callRequest(url, data, conf)
    const success = this.init.customCode?.success.includes(result.code) || false
    if (success) {
      result.code = 0
    }
    return result
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import * as Qs from 'qs'
export interface FormatKeysType {
  code: string;
  result: string;
  message: string;
}
export interface OptionType {
  jsonData: boolean;
  formatKeys: FormatKeysType;
  successCode: Array<number>;
  timeout?: number;
  baseURL?: string;
  errorMessage?: Record<number, string>;
}
export interface ResponseType {
  headers: Record<string, any>;
  status: number;
  statusText: string;
  data: DataType;
}
export interface DataType {
  // statusCode: number; // http状态码
  code: number; // 服务端自定义状态码
  result: any; // 结果项
  message: string; // 信息
}
export interface ConfigOptionType {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, any>;
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
  private resultData: DataType = {
    code: -1,
    result: {},
    message: ''
  }

  // responseType
  private responseData: ResponseType

  // 初始化参数
  private init: OptionType = {
    timeout: 1000,
    baseURL: '/',
    jsonData: true,
    formatKeys: { code: 'code', result: 'result', message: 'message' } as FormatKeysType,
    errorMessage: {
      400: '请求发生错误，请联系工程师（400）',
      401: '登陆信息失效，请重新登录（401）', // token无效，需要登录
      402: '您的登录信息已过期（402）', // token过期，请求刷新token
      403: '你没有足够的权限访问该资源（403）', // token权限不足，访问被禁止
      404: '请求地址不存在，无法找到对应的资源（404）',
      405: '服务器拒绝了你的请求（405）', // 禁用请求中指定的方法
      500: '请求错误，请联系工程师（500）', // 服务器遇到错误，无法完成请求
      501: '请求异常，请联系工程师（501）', // 服务器不具备完成请求的功能
      502: '数据异常，请联系工程师（502）', // 从服务器收到无效的响应
      503: '服务繁忙，请稍候再试（503）', // 服务器超载或停机维护，暂时状态
      504: '连接超时，请稍候再试（504）', // 未接收到服务器的响应
      505: '不受支持的请求，请联系工程师（505）' // http版本不受支持
    },
    successCode: []
  }

  // 一、初始化
  constructor (option?: OptionType) {
    Object.assign(this.init, option)
    // 初始化响应结果, 以提供规范的响应结果
    this.responseData = { headers: {}, data: this.resultData, status: 200, statusText: '' }
    // 默认的请求数据转换
    const config = this.init.jsonData ? {} : {
      transformRequest: [(data: Record<string, any>) => { return Qs.stringify(data) }]
    }
    const timeout = this.init.timeout || 10000
    const baseURL = this.init.baseURL || '/'
    this.http = axios.create(Object.assign({ baseURL, timeout }, config))
    this.setInterceptor()
  }

  private getResultData () { return this.resultData }

  private getResponseData () { return this.responseData }

  private getDataType (v: any): string { return Object.prototype.toString.call(v).slice(8, -1).toLowerCase() }

  // 定义拦截器
  private setInterceptor () {
    // 1. 请求拦截
    this.http.interceptors.request.use((config) => {
      return config
    }, (error) => {
      const res = this.getResponseData()
      res.status = 505
      res.statusText = JSON.stringify(error)
      res.data.message = '请求出错了'
      return Promise.reject(res)
    })

    // 2. 响应拦截
    this.http.interceptors.response.use(
      (response) => {
      // 处理正常响应
        const res = this.transformResponseData(response, 'success')
        return Object.assign(response, res)
      },
      (error) => {
      // 处理http状态码级别的错误
        const response = error.response
        const data = this.getResultData()
        const responseData = this.getResponseData()
        if (response) {
        // 有响应对象
          Object.assign(responseData, this.transformResponseData(response, 'error'))
        } else {
        // 没有响应对象
          const errorText = JSON.stringify(error) || ''
          const status = errorText.indexOf('timeout of') > -1 ? 504 : 502
          const errorMessage = this.init?.errorMessage || {}
          Object.assign(data, { message: errorMessage[status] })
          Object.assign(responseData, { data, status })
        }
        return Promise.reject(responseData)
      }
    )
  }

  // 转换响应数据格式
  private transformResponseData (response: any, type: string) {
    const resData = this.getResultData()
    const res = this.getResponseData()
    res.status = response?.status || 500
    res.headers = response.headers || {}
    res.statusText = response.statusText || ''
    const { data } = response
    if (data) {
    // 1. 后端有返回的数据
      const errorMessage = this.init.errorMessage || {}
      let code = -1
      let message = errorMessage[res.status] || '请求发生错误，请联系工程师' + `(${res.status})`
      let result = {}
      if (this.getDataType(data) === 'object') {
        const k = this.init.formatKeys
        code = response.data[k.code]
        code = isNaN(code) ? -1 : code * 1
        result = response.data[k.result] || {}
        message = response.data[k.message] || ''
      } else {
        message = type !== 'error' ? '错误响应，未获取预期数据' : message
      }
      Object.assign(resData, { code, message, result })
    } else {
    // 2. 无数据返回 将 statusCode 定义为 502
      res.status = 502
      Object.assign(resData, { message: `响应错误，未获取预期数据(${res.status})` })
    }
    res.data = resData
    return res
  }

  // 调用axios请求，无论成功失败，都将返回统一的数据格式
  private async doRequest (url: string, data: Record<string, any>, config: ConfigType): Promise<ResponseType> {
    const res = this.getResponseData()
    const post = ['post', 'put', 'patch']
    const mArrs = post.concat(['get', 'delete', 'head', 'options'])
    const confMethod = config?.method || 'get'
    const method = mArrs.includes(confMethod) ? confMethod : 'get'
    const query = post.includes(method) ? { data } : { params: data }
    try {
      const response = await this.http({ url, method, ...Object.assign(query, config.option) })
      res.data = response.data
      res.headers = response.headers
      res.status = response.status
      res.statusText = response.statusText
      return res
    } catch (error) {
      return error
    }
  }

  /**
   * 执行ajax请求, 都将返回统一格式的结果, result.code = 0 代表请求成功，为其他数时则表示不成功。
   * @param url 请求的url地址
   * @param data 请求体参数
   * @param config 请求参数配置
   */
  async ajax (url: string, data: Record<string, any>, config: ConfigType): Promise<ResponseType> {
    const conf: ConfigType = Object.assign({ method: 'get', option: {} }, config)
    const result = await this.doRequest(url, data, conf)
    if (this.init.successCode.includes(result.data.code)) {
      result.data.code = 0
    } else {
      result.data.message = result.data.message || `数据获取失败了（${result.data.code}）`
    }
    return result
  }
}

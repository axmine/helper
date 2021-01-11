import {
  TInitOption,
  TInitOptionCustomCode,
  TFormatKeys,
  TErrorMessage,
} from './Axios.dto'

export const initOption: TInitOption = {
  timeout: 1000,
  baseURL: '/',
  jsonData: false,
  formatKeys: {
    code: 'code',
    result: 'result',
    message: 'message'
  } as TFormatKeys,
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
    // 600: '响应超时，请确保您的设备已正常联网',
    // 601: '你的设备已离线，请确保你的设备已联网（601）',
    // 700: '请求发生错误，请稍候再试'
  } as TErrorMessage,
  customCode: {
    success: [0, 2000, 2010, 2040]
  } as TInitOptionCustomCode,
}
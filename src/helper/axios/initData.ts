import { TInitOption, TFormatKeys, TErrorMessage } from './Axios.dto'

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
    401: 'token过期, 刷新token', // token过期, 刷新token
    402: '登陆失效了，请重新登录', // token无效，需重新登录
    403: '你没有足够的权限访问该资源（403）', // token权限不足，访问被禁止
    405: '服务器拒绝了你的请求（405）', // token权限不足，访问被禁止
    404: '请求错误，资源不存在（404）',
    500: '程序异常, 请稍候再试（500）',
    501: '程序异常，请稍候再试（501）',
    502: '程序异常，请稍候再试（502）',
    503: '程序异常，请稍候再试（503）',
    504: '连接错误，请稍候再试（504）',
    505: '程序无法响应，请稍候再试（505）',
    600: '响应超时，请确保您的设备已正常联网',
    601: '你的设备已离线，请确保你的设备已联网（601）',
    700: '请求发生错误，请稍候再试'
  } as TErrorMessage
}
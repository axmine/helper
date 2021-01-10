
// 转换类型分为: 响应成功时， 响应失败时
export enum TTransformData {
  SUCCESS = 'success',
  ERROR = 'error'
}

// errorMessage的类型
export class TErrorMessage {
  [key: number]: string
}

export class TInitOptionCustomCode {
  success?: Array<number>;
  tokenError?: Array<number>;
  tokenFresh?: Array<number>;
  authError?: Array<number>;
}
// Axios 初始化参数
export class TInitOption {
  timeout?: number;
  baseURL?: string;
  jsonData?: boolean;
  reTry: number;
  formatKeys?: TFormatKeys;
  customCode?: TInitOptionCustomCode;
  errorMessage?: TErrorMessage;
}

// format Key
export class TFormatKeys {
  code: string;
  result: string;
  message: string;
}

// 调用Axios方法返回的参数
export class TResultData {
  statusCode: number; // http状态码
  code: number; // 服务端自定义状态码
  result: any; // 结果项
  message: string; // 信息
}
export enum TRequestConfigMethod {
  GET = 'get', // get
  POST = 'post', // create
  PUT = 'put', // 完整更新资源
  PATCH = 'patch', // 部分更新资源
  DELETE = 'delete', // 删除资源
  HEAD = 'head', // 获取元数据, 不常用
  OPTIONS = 'options' // 获取信息，如资源的可更改属性
}
export class TRequestConfigOption {
  baseURL?: string;
  timeout?: number;
  headers?: JSON;
  [key: string]: any;
}
// 发请http请求时的配置参数
export class TRequestConfig {
  method?: TRequestConfigMethod;
  showNotify?: boolean;
  option?: TRequestConfigOption;
  [key: string]: any;
}


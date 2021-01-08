
// 转换类型分为: 响应成功时， 响应失败时
export enum TTransformData {
  SUCCESS = 'success',
  ERROR = 'error'
}

// errorMessage的类型
export class TErrorMessage {
  [key: number]: string
}
// Axios 初始化参数
export class TInitOption {
  timeout?: number;
  baseURL?: string;
  jsonData?: boolean;
  errorMessage?: TErrorMessage;
  formatKeys?: TFormatKeys;
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


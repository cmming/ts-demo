export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  // 用于抛异常，显示取消的原因
  throwIfRequested(): void
}

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  // post请求的参数
  data?: any
  // get请求参数
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number

  // 字符串索引签名，方便用户自定义请求数据
  [propName: string]: any

  // 请求和响应配置化
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  // 取消请求
  cancelToken?: CancelToken
  // 跨域携带cookies
  withCredentials?: boolean
}

export interface AxiosResponse<T = any> {
  // 接口响应数据泛型
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

// 定义扩展接口
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: String, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: String, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: String, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: String, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: String, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: String, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: String, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // 函数重载
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 拦截器定义
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

// 取消请求的方法定义
export interface Canceler {
  (message?: string): void
}
// CancelToken类构造函数的接口定义
export interface CancelExecutor {
  (cancel: Canceler): void
}

// canceltoken 扩展的静态方法的接口定义
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

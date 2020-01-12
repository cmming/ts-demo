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
}

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

// 定义扩展接口
export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise

  get(url: String, config?: AxiosRequestConfig): AxiosPromise

  delete(url: String, config?: AxiosRequestConfig): AxiosPromise

  head(url: String, config?: AxiosRequestConfig): AxiosPromise

  options(url: String, config?: AxiosRequestConfig): AxiosPromise

  post(url: String, data?: any, config?: AxiosRequestConfig): AxiosPromise

  put(url: String, data?: any, config?: AxiosRequestConfig): AxiosPromise

  patch(url: String, data?: any, config?: AxiosRequestConfig): AxiosPromise
}

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise

  // 函数重载
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}

import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import dispatchRequest from './dispatchRequest'
/**
 * 用于实现 axios
 * 1.具有函数功能
 * 2.具有类的属性
 */

export default class Axios {
  request(url: any, config?: any): AxiosPromise {
    console.log(url)
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  get(url: String, config?: AxiosRequestConfig | undefined): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: String, config?: AxiosRequestConfig | undefined): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  head(url: String, config?: AxiosRequestConfig | undefined): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }
  options(url: String, config?: AxiosRequestConfig | undefined): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }
  post(url: String, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }
  put(url: String, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }
  patch(url: String, data?: any, config?: AxiosRequestConfig | undefined): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  // 发送请求头中没有数据的请求内部函数
  _requestMethodWithoutData(
    method: Method,
    url: String,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(
    method: Method,
    url: String,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}

import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest, { transformUrl } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from '../core/mergeConfig'

// 用于定义axios下Interceptors属性
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

/**
 * 用于实现 axios
 * 1.具有函数功能
 * 2.具有类的属性
 */

export default class Axios {
  // 默认配置
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)
    config.method = config.method.toLowerCase()

    const chain: PromiseChain[] = [
      {
        // dispatchRequest 发送请求
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      // 先执行后添加的
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      // 先执行先添加的
      chain.push(interceptor)
    })

    // 返回个Promise对象，最终状态由then方法执行决定
    let promise = Promise.resolve(config)

    while (chain.length) {
      // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
    // return dispatchRequest(config)
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

  getUrl(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformUrl(config)
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

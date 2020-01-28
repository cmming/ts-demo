import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  // 在没有请求方式的情况下发送请求
  test('should make a http request without verb helper', () => {
    const instance = axios.create()

    instance('/foo')
    return getAjaxRequest().then(res => {
      expect(res.url).toBe('/foo')
    })
  })

  // 发送get请求
  test('should make a http request', () => {
    const instance = axios.create()

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('get')
    })
  })
  // 发送delete请求
  test('should make a delete request', () => {
    const instance = axios.create()

    instance.delete('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('delete')
    })
  })
  // 发送head请求
  test('should make a head request', () => {
    const instance = axios.create()

    instance.head('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('head')
    })
  })
  // options
  test('should make a options request', () => {
    const instance = axios.create()

    instance.options('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('options')
    })
  })
  // put
  test('should make a put request', () => {
    const instance = axios.create()

    instance.put('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('put')
    })
  })
  // patch
  test('should make a patch request', () => {
    const instance = axios.create()

    instance.patch('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('patch')
    })
  })

  //
  test('should have defaults.headers', () => {
    const instance = axios.create({ baseURL: 'https://api.example.com' })

    expect(typeof instance.defaults.headers).toBe('object')
    expect(typeof instance.defaults.headers.common).toBe('object')
  })

  // 根据请求参数获取请求的url
  test('should get the computed uri', () => {
    const fakeConfig: AxiosRequestConfig = {
      baseURL: 'https://www.baidu.com/',
      url: '/user/12345',
      params: {
        idClient: 1,
        idTest: 2,
        testString: 'thisIsATest'
      }
    }
    expect(axios.getUrl(fakeConfig)).toBe(
      'https://www.baidu.com/user/12345?idClient=1&idTest=2&testString=thisIsATest'
    )
  })

  // 测试添加拦截器
  test('should have interceptors on the instance', done => {
    axios.interceptors.request.use(config => {
      config.timeout = 2000
      return config
    })

    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.withCredentials = true
      return config
    })

    instance.interceptors.response.use(response => {
      response.headers['test-response-interceptor'] = 'test'
      return response
    })

    let response: AxiosResponse

    instance.get('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })

      setTimeout(() => {
        expect(response.config.withCredentials).toBeTruthy()
        expect(response.config.timeout).toBe(0)
        expect(response.headers['test-response-interceptor']).toBe('test')
        done()
      }, 10)
    })
  })
})

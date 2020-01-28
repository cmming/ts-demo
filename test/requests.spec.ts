import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('get')
    })
  })

  test('should treat method value as lowercase string', done => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  //   测试超时
  test('should reject when request timeout', done => {
    let err: AxiosError

    axios('/foo', {
      timeout: 3000,
      method: 'post'
    }).catch(error => {
      err = error
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')
      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 3000 ms exceeded')
        done()
      }, 100)
    })
  })

  //   测试状态码
  test('should reject when validateStatus returns false', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })
    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response!.status).toBe(500)

      done()
    }
  })

  test('should resolve when validateStatus returns true', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })

    function next(res: AxiosResponse | AxiosError) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(res.config.url).toBe('/foo')

      done()
    }
  })

  // 测试返回值（成功应该返回json）
  test('should return json when resolve', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"a": 1}'
      })

      setTimeout(() => {
        expect(response.data).toEqual({ a: 1 })
        done()
      }, 100)
    })
  })

  // 测试返回值（失败返回值应该为json）
  test('should return json when reject', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      response = error.response
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.error).toBe('BAD USERNAME')
        expect(response.data.code).toBe(1)
        done()
      }, 100)
    })
  })

  // 测试自定义响应数据的类型
  test('should support array buffer response', done => {
    let response: AxiosResponse

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    axios('/foo', {
      responseType: 'arraybuffer'
    }).then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world')
      })

      setTimeout(() => {
        expect(response.data.byteLength).toBe(22)
        done()
      }, 100)
    })
  })

  // test('should reject on network errors', () => {
  //   const resolveSpy = jest.fn((res: AxiosResponse) => {
  //     return res
  //   })

  //   const rejectSpy = jest.fn((e: AxiosError) => {
  //     return e
  //   })

  //   jasmine.Ajax.uninstall()

  //   return axios('/foo')
  //     .then(resolveSpy)
  //     .catch(rejectSpy)
  //     .then(next)

  //   function next(reason: AxiosResponse | AxiosError) {
  //     expect(resolveSpy).not.toHaveBeenCalled()
  //     expect(rejectSpy).toHaveBeenCalled()
  //     expect(reason instanceof Error).toBeTruthy()
  //     expect((reason as AxiosError).message).toBe('Network Error')
  //     expect(reason.request).toEqual(expect.any(XMLHttpRequest))

  //     jasmine.Ajax.install()
  //   }
  // })
})

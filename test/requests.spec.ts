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
})

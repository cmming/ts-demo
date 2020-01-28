import axios from '../src/index'
import { getAjaxRequest } from './helper'
import { request } from 'http'

/**
 *
 * @param headers 请求头对象
 * @param key 要判断请求头的key。
 * @param val 指定key的值
 */
function testHeaderValue(headers: any, key: string, val?: string): void {
  let found = false

  for (let k in headers) {
    if (k.toLowerCase() === key.toLowerCase()) {
      found = true
      expect(headers[k]).toBe(val)
      break
    }
  }

  // 用于测试undefined的情况
  if (!found) {
    if (typeof val === 'undefined') {
      expect(headers.hasOwnProperty(key)).toBeFalsy()
    } else {
      throw new Error(key + ' was not found in headers')
    }
  }
}

describe('header', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  // 测试common的请求头
  test('should use default common headers', () => {
    const headers = axios.defaults.headers.common

    axios('/foo')

    return getAjaxRequest().then(request => {
      console.log(headers)
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          expect(request.requestHeaders[key]).toEqual(headers[key])
        }
      }
    })
  })

  // post有数据的时候，修改请求头
  test('should add extra headers for post', () => {
    axios.post('/foo', 'foo=bar')

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'content-type', 'application/x-www-form-urlencoded')
    })
  })

  // 当发送的数据格式为object时，content-type为 application/json;charset=utf-8
  test('should use application/json when post an object', () => {
    axios.post('/foo', { foo: 'bar' })

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'content-type', 'application/json;charset=utf-8')
    })
  })

  // 当传递数据为空的时候，content-type 为undefined
  test('should remove content-type if data is empty', () => {
    axios.post('/foo')

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })
  it('should preserve content-type if data is false', () => {
    axios.post('/foo', false)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('should remove content-type if data is FormData', () => {
    const data = new FormData()
    data.append('foo', 'bar')

    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })
})

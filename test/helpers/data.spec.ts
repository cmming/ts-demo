import { transformRequest, transformResponse } from '../../src/helpers/data'

describe('helper:data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a PlainObject', () => {
      const a = { a: 1 }
      expect(transformRequest(a)).toBe('{"a":1}')
    })

    test('should do nothing if data is not PlainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('should transform response data parse to Object if data is a json string', () => {
      const a = '{"a": 2}'
      expect(transformResponse(a)).toEqual({ a: 2 })
    })

    test('should do nothing if data is a string but a Json String', () => {
      const a = '{a:2}'
      expect(transformResponse(a)).toEqual(a)
    })

    test('should do nothing if data is not a string', () => {
      const a = { a: 2 }
      expect(transformResponse(a)).toEqual(a)
    })
  })
})

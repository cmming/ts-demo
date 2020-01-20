import { buildURL, isURLSameOrigin, isAbsoluteURL, combineURL } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support URLSearchParams params', () => {
      expect(buildURL('/foo', new URLSearchParams('a=1&b=c'))).toBe('/foo?a=1&b=c')
    })

    test('should support PlainObject params', () => {
      expect(buildURL('/foo', { a: 1, b: 'c' })).toBe('/foo?a=1&b=c')
    })

    test('should support PlainObject params value is undefined', () => {
      expect(buildURL('/foo', { a: 1, b: 'c', d: undefined })).toBe('/foo?a=1&b=c')
    })
    test('should support PlainObject params value is null', () => {
      expect(buildURL('/foo', { a: 1, b: 'c', d: null })).toBe('/foo?a=1&b=c')
    })

    test('should support PlainObject params value is Array', () => {
      expect(buildURL('/foo', { a: 1, b: 'c', d: [1, 2, 3] })).toBe(
        '/foo?a=1&b=c&d[]=1&d[]=2&d[]=3'
      )
    })

    test('should support PlainObject params value is only null', () => {
      expect(buildURL('/foo', { a: null })).toBe(`/foo`)
    })
    test('should support PlainObject params value is null', () => {
      expect(buildURL('/foo', { a: null, b: 2 })).toBe(`/foo?b=2`)
    })
    test('should support PlainObject params value is Date', () => {
      const a = new Date()
      expect(buildURL('/foo', { a: a })).toBe(`/foo?a=${a.toISOString()}`)
    })

    test('should support PlainObject params value is object', () => {
      const foo = { foo: { b: 'b' } }
      expect(buildURL('/foo', foo)).toBe(`/foo?foo=` + encodeURI('{"b":"b"}'))
    })

    test('should support PlainObject params value is special string', () => {
      const foo = { foo: '@:$, []' }
      expect(buildURL('/foo', foo)).toBe(`/foo?foo=@:$,+[]`)
    })

    test('should splice discard url hash mark ,', () => {
      const foo = { foo: 'bar' }
      expect(buildURL('/foo#hashmark', foo)).toBe(`/foo?foo=bar`)
    })

    test('should contact existing params', () => {
      const foo = { foo: 'bar' }
      expect(buildURL('/foo?a=1', foo)).toBe(`/foo?a=1&foo=bar`)
    })

    test('should use serializer if provider', () => {
      const foo = { foo: 'baz' }
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      expect(buildURL('/foo?a=1', foo, serializer)).toBe(`/foo?a=1&foo=bar`)
    })
  })

  describe('isURLSameOrigin', () => {
    test('should the same origin', () => {
      expect(isURLSameOrigin(window.location.hash)).toBeTruthy()
    })

    test('should the same origin', () => {
      expect(isURLSameOrigin('http://www.gihub.com')).toBeFalsy()
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('http://www.vesystem.com')).toBeTruthy()
      expect(isAbsoluteURL('VEAPP://www.vesystem.com')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://www.vesystem.com')).toBeTruthy()
    })

    test('should return true if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('!VEAPP://www.vesystem.com')).toBeFalsy()
      expect(isAbsoluteURL('123://www.vesystem.com')).toBeFalsy()
    })
    // 可以没有 scheme name
    test('should return true if URL is procol relative', () => {
      expect(isAbsoluteURL('//www.vesystem.com')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slashes', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com', '')).toBe('https://api.github.com')
    })
  })
})

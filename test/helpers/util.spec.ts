import {
  isDate,
  isPlainObject,
  isFormData,
  isURLSearchParams,
  extend,
  deepMerge
} from '../../src/helpers/util'

describe('helper:util', () => {
  describe('isXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    // test isPlainObject
    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })

    test('should validate FormDate', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('should validate UrlsEARCHParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('a=1&b=2')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }

      extend(a, b)

      expect(a.foo).toBe(123)
    })

    test('should extend properties', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }

      const c = extend(a, b)

      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  //   测试 深度合并
  test('should deepMerge properties', () => {
    const a = { foo: 123 }
    const b = { bar: 456 }
    const c = { foo: 789 }

    const d = deepMerge(a, b, c)

    expect(d.foo).toBe(789)
    expect(d.bar).toBe(456)
  })

  test('should deepMerge recursively', () => {
    const a = { foo: { bar: 123 } }
    const b = { foo: { baz: 456 }, bar: { qux: 789 } }
    const c = deepMerge(a, b)

    expect(c).toEqual({
      foo: {
        bar: 123,
        baz: 456
      },
      bar: {
        qux: 789
      }
    })
  })

  test('should handle null and undefined arguments', () => {
    expect(deepMerge(undefined, undefined)).toEqual({})
    expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
    expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 })

    expect(deepMerge(null, null)).toEqual({})
    expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
    expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })
  })
})

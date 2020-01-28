import Cancel, { isCancel } from '../../src/cancel/Cancel'

describe('cancel:Cancel', () => {
  // 指定消息时返回正确的消息
  test('should returns correct result when message is specified', () => {
    const cancel = new Cancel('Operation has been canceled.')
    expect(cancel.message).toBe('Operation has been canceled.')
  })

  // 测试 isCancel 方法
  test('should returns true if value is a Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  // 测试 isCancel 方法
  test('should returns false if value is not a Cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})

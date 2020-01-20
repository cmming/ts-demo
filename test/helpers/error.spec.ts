import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers::error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      data: { foo: 'bar' },
      status: 200,
      statusText: 'OK',
      headers: null,
      config,
      request
    }

    const error = createError('this is a test error', config, 'something', request, response)

    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('this is a test error')
    expect(error.config).toBe(config)
    expect(error.code).toBe('something')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
  })
})

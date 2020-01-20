import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

// 整理请求头
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    // 将请求头的属性名进行规范化
    if (name !== normalizedName && name.toLowerCase() === normalizedName.toLowerCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

// 根据参数设置默认的Content-Type
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
// 处理响应头信息
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  // 使用换行和空格键
  headers.split('\r\n').forEach(line => {
    // 修复 val中存在 ：，如 Date: Tue, 21 May 2019 09:23:44
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    // if (val) {
    //   val = val.trim()
    // }
    // 修复 val中存在 ：，如 Date: Tue, 21 May 2019 09:23:44
    let val = vals.join(':').trim()
    parsed[key] = val
  })
  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  // 删除多余的信息
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}

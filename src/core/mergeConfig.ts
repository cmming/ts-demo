import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

// 临时存储配置 这样创建出来的对象相较于{}，没有任何的属性，可以用来作为一个非常纯净的mao来使用
const strats = Object.create(null)

// 默认合并策略 如果第二个配置有的属性，默认优先适用第二个配置的
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只接受自定义配置合并策略
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 处理复杂对象
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

// 返回一个函数
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

// 整体思路：对config1和config2中的属性进行遍历，执行mergeField方法进行合并；
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    // 会将 headers
    config[key] = strat(config1[key], config2![key])
  }

  return config
}

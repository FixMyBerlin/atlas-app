import { isDev } from './app/_components/utils/isEnv'
import { memoize } from 'lodash'

export function warnDev(...args) {
  if (isDev) {
    console.error(...args)
  }
}

export function errorDev(...args) {
  if (isDev) {
    console.error(...args)
  }
}

export function globalize(values: Record<string, any>) {
  // for debugging only
  // const test = 'TEST'
  // globalize({ test }) to make variable test available as window.test
  if (typeof window !== 'undefined') {
    Object.entries(values).forEach(([name, value]) => {
      window[name] = value
    })
  }
}

export function logValues(values: Record<string, any>) {
  // for debugging only
  Object.entries(values).forEach(([name, value]) => {
    console.log(`${name}:`, typeof value, value)
  })
}

export function createLogger(prefix: string) {
  // for debugging only
  return (...values) => console.log(`${prefix}:`, ...values)
}

export const logMemo = memoize(console.log, (...args) => JSON.stringify(args))

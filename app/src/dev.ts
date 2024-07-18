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

export function logColor(msg, color) {
  console.log('%c' + msg, 'color:' + color + ';font-weight:bold;')
}

export function compareValuesBetweenRenders(
  info: string,
  values: Record<string, any>,
  ref: React.MutableRefObject<{}>,
  logChange: boolean,
) {
  Object.entries(values).forEach(([k, v]) => {
    const changed = v !== ref[k]
    console.log('COMPARE', info, k, changed ? 'CHANGED' : '')
    if (logChange && changed) {
      console.log(`  previous ${k}:`, ref[k])
      console.log(`  current  ${k}:`, v)
    }
    ref[k] = v
  })
}

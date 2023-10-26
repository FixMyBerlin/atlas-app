import jsurl from 'jsurl2'
import { legacyParse } from './legacyParse'
import { expandObjectKeys, minimizeObjectKeys } from './minimzeObjectKeys'

// Docs: https://react-location.tanstack.com/guides/custom-search-param-serialization#using-jsurl
// Using https://github.com/wmertens/jsurl2

export const customParse = (value: string) => {
  // "!" is an array in jsurl2, which is the default for our config
  // "(" is an object in jsurl2, which is the reset-fallback
  const newEncoding = value.startsWith('!') || value.startsWith('(')

  if (newEncoding) {
    return expandObjectKeys(jsurl.tryParse(value, { reset: true }))
  }

  return legacyParse(value)
}

export const customStringify = (value: Record<string, any>) => {
  return jsurl.stringify(minimizeObjectKeys(value), {
    rich: true,
    short: false,
  })
}

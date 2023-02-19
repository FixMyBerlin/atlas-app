import jsurl from 'jsurl2'
import { legacyParse } from './legacyParse'
import { expandObjectKeys, minimizeObjectKeys } from './minimzeObjectKeys'

// Docs: https://react-location.tanstack.com/guides/custom-search-param-serialization#using-jsurl
// Using https://github.com/wmertens/jsurl2

export const customParse = (value: string) => {
  const newEncoding = value.startsWith('!')
  if (newEncoding) return expandObjectKeys(jsurl.parse(value))

  return legacyParse(value)
}

export const customStringify = (value: Record<string, any>) => {
  return jsurl.stringify(minimizeObjectKeys(value))
}

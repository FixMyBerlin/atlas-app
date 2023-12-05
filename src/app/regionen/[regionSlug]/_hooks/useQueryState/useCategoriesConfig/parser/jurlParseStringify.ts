import jsurl from 'jsurl2'

// Docs: https://react-location.tanstack.com/guides/custom-search-param-serialization#using-jsurl
// Using https://github.com/wmertens/jsurl2

export const isJsurlString = (value: string) => {
  // "!" is an array in jsurl2, which is the default for our config
  // "(" is an object in jsurl2, which is the reset-fallback
  return value.startsWith('!') || value.startsWith('(')
}

export const jsurlParse = (value: string): unknown => {
  return jsurl.tryParse(value, { reset: true })
}

export const jurlStringify = (value: Record<string, any>) => {
  return jsurl.stringify(value, {
    rich: true,
    short: false,
  })
}

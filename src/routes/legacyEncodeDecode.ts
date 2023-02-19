import jsurl from 'jsurl2'
import { parse } from 'zipson/lib'

// See https://react-location.tanstack.com/guides/custom-search-param-serialization#safe-binary-encodingdecoding
function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}

const decodeAndParse = (value: string) => {
  return parse(decodeURIComponent(decodeFromBinary(value)))
}

export const updateLegacyEncoding = (value: string) => {
  const newEncoding = value.startsWith('!')
  if (newEncoding) return value

  const decoded = decodeAndParse(value)
  return jsurl.stringify(decoded)
}

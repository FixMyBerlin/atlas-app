// See https://react-location.tanstack.com/guides/custom-search-param-serialization#safe-binary-encodingdecoding

import { parse, stringify } from 'zipson/lib'

export function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    })
  )
}

export function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}

export const decodeAndParse = (value: string) => {
  return parse(decodeURIComponent(decodeFromBinary(value)))
}

export const encodeAndStringify = (value: Record<string, unknown>) => {
  return encodeToBinary(encodeURIComponent(stringify(value)))
}

'use client'

import { parse } from 'zipson/lib'

// See https://react-location.tanstack.com/guides/custom-search-param-serialization#safe-binary-encodingdecoding
function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join(''),
  )
}

export const legacyParse = (value: string) => {
  // No need to use expandObjectKeys() here since the legacy schema did not use minifiedObjectKeys
  return parse(decodeURIComponent(decodeFromBinary(value)))
}

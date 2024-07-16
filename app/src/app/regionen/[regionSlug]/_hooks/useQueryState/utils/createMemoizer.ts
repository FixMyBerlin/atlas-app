import { isEqual, isFunction } from 'lodash'

export const createMemoizer = function createMemoizer() {
  let prevKey: any
  let prevObj: any
  return <T>(obj: T) => {
    const key = Object.fromEntries(
      Object.entries(obj as Record<string, any>).filter(([_, v]) => !isFunction(v)),
    )
    if (!isEqual(key, prevKey)) {
      prevKey = key
      prevObj = obj
    }
    return prevObj as T
  }
}

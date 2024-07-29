export const createMemoizer = function createMemoizer() {
  let prevKey: string
  let prevObj: any
  return <T extends { [key: string]: any }>(obj: T): T => {
    const key = JSON.stringify(obj)
    if (key !== prevKey) {
      prevKey = key
      prevObj = obj
    }
    return prevObj
  }
}

export function log(...args) {
  const t = (new Date(new Date().toUTCString())).toISOString().split('.')[0]
  console.log(t, ...args)
}

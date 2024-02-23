import chalk from 'chalk'

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
export function lng2tile(lng, zoom) {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, zoom))
}

export function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2) *
    Math.pow(2, zoom),
  )
}

export function formatDuration(ms) {
  const s = ms / 1000
  const secondsToColor = [
    [120, [255, 0, 0]],
    [60, [255, 64, 0]],
    [30, [255, 128, 0]],
    [10, [255, 192, 0]],
    [5, [255, 255, 0]],
  ]
  let formatted = `${s}s`
  secondsToColor.forEach(([seconds, color]) => {
    if (s >= seconds) {
      formatted = chalk.rgb(...color)(formatted)
      return false
    }
  })
  return formatted
}

// https://stackoverflow.com/a/39906526
const units = ['B', 'K', 'M', 'G']
export function formatBytes(b) {
  let l = 0,
    n = parseInt(b, 10) || 0
  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  let formatted = n.toFixed(n < 10 && l > 0 ? 1 : 0) + units[l]
  const bytesToColor = [
    [2500000, [255, 0, 0]],
    [1250000, [255, 128, 0]],
    [500000, [255, 192, 0]],
    [250000, [255, 255, 0]],
  ]
  bytesToColor.forEach(([bytes, color]) => {
    if (b >= bytes) {
      formatted = chalk.rgb(...color)(formatted)
      return false
    }
  })
  if (b === 0) {
    formatted = chalk.red(formatted)
  }
  return formatted
}

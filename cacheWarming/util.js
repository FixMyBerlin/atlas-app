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

function colorString(v, s, colorTable) {
  for (let i in colorTable) {
    const [treshold, [r, g, b]] = colorTable[i]
    if (v >= treshold) {
      return chalk.rgb(r, g, b)(s)
    }
  }
  return s
}

export function formatDuration(ms) {
  const seconds = ms / 1000
  const formatted = `${seconds.toFixed(3)}s`
  return colorString(seconds, formatted, [
    [120, [255, 0, 0]],
    [60, [255, 64, 0]],
    [30, [255, 128, 0]],
    [10, [255, 192, 0]],
    [5, [255, 255, 0]],
  ])
}

// https://stackoverflow.com/a/39906526
const units = ['B', 'K', 'M', 'G']
export function formatBytes(bytes) {
  let l = 0
  let n = parseInt(bytes, 10) || 0
  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  let formatted = n.toFixed(n < 10 && l > 0 ? 1 : 0) + units[l]
  if (bytes === 0) {
    return chalk.red(formatted)
  }
  return colorString(bytes, formatted, [
    [2500000, [255, 0, 0]],
    [1250000, [255, 128, 0]],
    [500000, [255, 192, 0]],
    [250000, [255, 255, 0]],
  ])
}

export function displayHelp() {
  console.log(`
Usage: node filterLog.js [OPTION]... [LOGFILE]...
Filter Logfile.
Example: node filterLog.js --grep=/roads/9 --miss --min-size=500K --min-time=2

Filter options:
  -e, --skip-errors do not display warnings and errors
  -h, --hit         display only cache hits
  -m, --miss        display only cache misses
  -s, --size        display results where the tilesize is at least given size
  -t, --time        display results where the response time is at least given time
  -g, --grep        display results where the request line contains given string
`.trim()
  )
}

import fs from 'node:fs'
import chalk from 'chalk'
import getStdin from 'get-stdin'

export function log(...args) {
  const t = new Date(new Date().toUTCString()).toISOString().split('.')[0]
  console.log(t, ...args)
}

export function error(message) {
  console.error(message)
  process.exit()
}

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
export function formatBytes(bytes, colorOutput) {
  let l = 0
  let n = parseInt(bytes, 10) || 0
  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  let formatted = n.toFixed(n < 10 && l > 0 ? 1 : 0) + units[l]
  if (bytes === 0) {
    return chalk.red(formatted)
  }
  if (colorOutput === undefined) colorOutput = true
  if (colorOutput) {
    formatted = colorString(bytes, formatted, [
      [2500000, [255, 0, 0]],
      [1250000, [255, 128, 0]],
      [500000, [255, 192, 0]],
      [250000, [255, 255, 0]],
    ])
  }
  return formatted
}

export async function getLogData(positionals) {
  let input
  if (process.stdin.isTTY === undefined) {
    input = await getStdin()
  } else {
    if (positionals.length === 0) error('Logfile argument is missing.')
    if (positionals.length > 1) error('Too many arguments.')
    const filename = positionals[0]
    if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)
    input = await Bun.file(filename).text()
  }
  return input.trim().split('\n')
}

export function parseTime(time) {
  if (time === undefined) return null
  const num = Number(time)
  if (!isNaN(num)) return num
  const m = time.trim().match(/^([0-9]+\.[0-9]{3})s$/)
  if (!m) return null
  return Number(m[1])
}

export function parseSize(size) {
  if (size === undefined) return null
  const num = Number(size)
  if (!isNaN(num)) return num
  const m = size.trim().match(/^([0-9.]+)([BKMG])$/)
  if (!m) return null
  let [_, bytes, unit] = m
  return Math.round(
    bytes *
      {
        B: 1,
        K: 1024,
        M: 1024 ** 2,
        G: 1024 ** 3,
      }[unit],
  )
}

export function removeTimeStamp(line) {
  return line.substring(line.indexOf(' ') + 1)
}

export function isRequest(line) {
  return removeTimeStamp(line).startsWith('🡇')
}

export function isError(line) {
  return removeTimeStamp(line).startsWith('⚠')
}

export function parseResponse(line) {
  let [cacheStatus, timeFormatted, sizeFormatted] = line.slice(2).split(' - ')
  return {
    cacheStatus,
    size: parseSize(sizeFormatted),
    time: parseTime(timeFormatted),
  }
}

export function displayFilterLogHelp() {
  console.log(
    `
Usage: ./filterLog.ts [OPTION]... [LOGFILE]...
Filter Logfile.
Example: ./filterLog.ts --grep=/roads/8 --hit --size=500K --time=1 warm-cache.log

Options:
  -e, --skip-errors  do not display warnings and errors
  -i, --skip-info    do not display additional information
  -h, --hit          display only cache hits
  -m, --miss         display only cache misses
  -s, --size         display results where the tilesize is at least given size
  -t, --time         display results where the response time is at least given time
  -g, --grep         display results where the url of the request line contains given string
  -v, --invert-match display non-matching results
`.trim(),
  )
}

export function displaySortLogHelp() {
  console.log(
    `
Usage: ./sortLog.ts [OPTION]... [LOGFILE]...
Sort logfile by Tile size.
Example: ./sortLog.ts warm-cache.log

Options:
  -d, --desc sort in descending order (from high to low)
`.trim(),
  )
}

export function displayAnalyzeTileLogHelp() {
  console.log(
    `
Usage: ./analyzeTile.ts [VECTORTILE]...
Analyze a vector tile (.pbf)
Example: ./analyzeTile.ts tile.pbf
`.trim(),
  )
}

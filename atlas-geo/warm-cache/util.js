import fs from 'node:fs'
import { InvalidArgumentError, InvalidOptionArgumentError } from 'commander'
import chalk from 'chalk'
import getStdin from 'get-stdin'
import { WebMercatorViewport } from 'viewport-mercator-project'

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

export function unproject(screen, center, zoom, points) {
  const { width, height } = screen
  const { lat, lng } = center
  const viewport = new WebMercatorViewport({
    width,
    height,
    latitude: lat,
    longitude: lng,
    zoom,
  })
  return points.map((p) => viewport.unproject(p))
}

export function getTilesBounds(screen, center, zoom) {
  const { width, height } = screen
  const [[sx0, sy0], [sx1, sy1]] = unproject(screen, center, zoom, [
    [0, 0],
    [width, height],
  ])
  return {
    x0: lng2tile(sx0, zoom),
    y0: lat2tile(sy0, zoom),
    x1: lng2tile(sx1, zoom),
    y1: lat2tile(sy1, zoom),
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Array} The bounding box [lonMin, latMin, lonMax, latMax]
 */
export function tile2bbox(x, y, z) {
  const lonMin = (x / Math.pow(2, z)) * 360 - 180
  const lonMax = ((x + 1) / Math.pow(2, z)) * 360 - 180
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)
  const latMin = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  const latMax =
    (180 / Math.PI) *
    Math.atan(
      0.5 *
        (Math.exp(n - (2 * Math.PI) / Math.pow(2, z)) -
          Math.exp(-(n - (2 * Math.PI) / Math.pow(2, z)))),
    )

  return [lonMin, latMin, lonMax, latMax]
}

export function createBox(x0, y0, x1, y1) {
  // prettier-ignore
  return [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]]
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

export function formatDuration(ms, colorOutput) {
  const seconds = ms / 1000
  let formatted = `${seconds.toFixed(3)}s`
  if (colorOutput === undefined) colorOutput = true
  if (colorOutput) {
    formatted = colorString(seconds, formatted, [
      [120, [255, 0, 0]],
      [60, [255, 64, 0]],
      [30, [255, 128, 0]],
      [10, [255, 192, 0]],
      [5, [255, 255, 0]],
    ])
  }
  return formatted
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

export async function getLogData(filename) {
  let input
  if (process.stdin.isTTY === undefined) {
    input = await getStdin()
  } else {
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

export function parseTimeOption(time) {
  const parsed = parseTime(time)
  if (parsed === null) throw new InvalidOptionArgumentError(`Could not parse "${time}".`)
  return parsed
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

export function parseSizeOption(size) {
  const parsed = parseSize(size)
  if (parsed === null) throw new InvalidOptionArgumentError(`Could not parse "${size}".`)
  return parsed
}

export function createParseNumberOption(parse, min, max) {
  return function (s) {
    const parsed = parse(s)
    const err = (msg) => {
      throw new InvalidOptionArgumentError(msg)
    }
    if (isNaN(parsed)) err(`Could not parse "${s}".`)
    if (min !== undefined && parsed < min) err(`Too small - minimum is ${min}.`)
    if (max !== undefined && parsed > max) err(`Too big - maximum is ${max}.`)
    return parsed
  }
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

export function parseSourceAndZoom(line) {
  line = removeTimeStamp(line)
  if (line.startsWith('⚑')) {
    const zoom = Number(line.split('/').slice(-3)[0])
    // TODO - add source
    return { zoom }
  } else {
    return null
  }
}

export function parseRequest(request) {
  request = removeTimeStamp(request)
  const url = request.split(' - ').reverse()[0]
  // prettier-ignore
  const [z, x, y] = url.split('/').slice(-3).map((s) => Number(s))
  return { x, y, z }
}

export function parseResponse(line) {
  line = removeTimeStamp(line)
  let [cacheStatus, timeFormatted, sizeFormatted] = line.slice(2).split(' - ')
  return {
    cacheStatus,
    size: parseSize(sizeFormatted),
    time: parseTime(timeFormatted),
  }
}

export function checkFile(filename) {
  const err = (msg) => {
    throw new InvalidArgumentError(msg)
  }
  if (!fs.existsSync(filename)) err(`'${filename}' does not exist.`)
  if (fs.lstatSync(filename).isDirectory()) err(`'${filename}' is a directory.`)
  return filename
}

export function fileExists(path) {
  try {
    return fs.existsSync(path) && fs.lstatSync(path).isFile()
  } catch (err) {
    return false
  }
}

export function folderExists(folderPath) {
  try {
    return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()
  } catch (err) {
    return false
  }
}

export function readJson(filename, log) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
  if (log) {
    console.log(`Read data from ${filename}.`)
  }
  return data
}

export function writeJson(data, filename, log) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2))
  log = log === undefined || log
  if (log) {
    console.log(`Saved data to ${filename}.`)
  }
}

export function writeGeojson(tiles, filename) {
  const geoJson = {
    type: 'FeatureCollection',
    features: tiles.map(({ coords: [x, y, z], ...properties }) => {
      const bbox = tile2bbox(x, y, z)
      return {
        type: 'Feature',
        properties,
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [bbox[0], bbox[1]],
              [bbox[2], bbox[1]],
              [bbox[2], bbox[3]],
              [bbox[0], bbox[3]],
              [bbox[0], bbox[1]],
            ],
          ],
        },
      }
    }),
  }
  writeJson(geoJson, filename)
}

export function createTileUrl(origin, pathnameTemplate, x, y, z) {
  return (origin || '') + pathnameTemplate.replace('{z}', z).replace('{x}', x).replace('{y}', y)
}

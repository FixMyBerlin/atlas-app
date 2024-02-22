const fs = require('node:fs')

const tilesBaseUrl = 'https://tiles.radverkehrsatlas.de'
const cacheWarmingConfigPath = 'cacheWarmingConfig.json'

console.log(`Loading config ${cacheWarmingConfigPath}...`)
const config = JSON.parse(fs.readFileSync(cacheWarmingConfigPath, 'utf8'))

const { bbox } = config

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
function lng2tile(lng, zoom) {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, zoom))
}

function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2) *
    Math.pow(2, zoom),
  )
}

function getTilesBounds(bbox, zoom) {
  const {
    min: [minLng, minLat],
    max: [maxLng, maxLat],
  } = bbox
  const [minX, maxX] = [lng2tile(minLng, zoom), lng2tile(maxLng, zoom)].sort()
  const [minY, maxY] = [lat2tile(minLat, zoom), lat2tile(maxLat, zoom)].sort()
  return { minX, maxX, minY, maxY }
}

const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

// https://stackoverflow.com/a/39906526
function niceBytes(x){
  let l = 0, n = parseInt(x, 10) || 0;
  while(n >= 1024 && ++l){
    n = n/1024;
  }
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

const { minZoom, maxZoom } = config

const padLeft = (num) => String(num).padStart(String(totalNumTiles).length)

let totalNumTiles = 0
for (let z = minZoom; z <= maxZoom; z++) {
  const { minX, maxX, minY, maxY } = getTilesBounds(bbox, z)
  const numTiles = (maxX - minX + 1) * (maxY - minY + 1)
  totalNumTiles += numTiles
}
totalNumTiles *= config.urls.length

const fetchTiles = async () => {
  console.log('Downloading tiles...');
  let tile = 1
  for (let z = minZoom; z <= maxZoom; z++) {
    const { minX, maxX, minY, maxY } = getTilesBounds(bbox, z)
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let i in config.urls) {
          const urlTemplate = config.urls[i]
          const zf = Math.floor(z)
          const url =
            tilesBaseUrl + urlTemplate.replace('{z}', zf).replace('{x}', x).replace('{y}', y)
          console.log(
            `Fetching ${padLeft(tile++)}/${totalNumTiles} - ${Math.floor(zf)}/${x}/${y} - ${url}`,
          )
          const start = new Date()
          const response = await fetch(url)
          const duration = (new Date() - start) / 1000
          if (response.ok) {
            const cacheStatus = response.headers.get('x-cache-status')
            const contentLength = response.headers.get('content-length')
            console.log(`${response.status} - ${cacheStatus} - ${duration}s`)
          } else {
            console.error(response.status, response.statusText)
          }
        }
      }
    }
  }
  process.exit(0)
}

fetchTiles()

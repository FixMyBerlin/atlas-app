import fs from 'node:fs'
import chalk from 'chalk'
import { lat2tile, lng2tile, formatBytes, formatDuration } from './util.js'
import dotenv from 'dotenv'

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });
const tilesBaseUrl = `https://${process.env.TILES_URL}`
const cacheWarmingConfigPath = 'config.json'

console.log(`Loading config ${cacheWarmingConfigPath}...`)
const config = JSON.parse(fs.readFileSync(cacheWarmingConfigPath, 'utf8'))

const { viewport, map } = config
const numTilesX = Math.ceil(viewport.width / 256)
const numTilesY = Math.ceil(viewport.height / 256)

const { lat, lng, zoomFrom, zoomTo } = map
const numZoomLevels = zoomTo - zoomFrom + 1
const totalNumTiles = numZoomLevels * numTilesX * numTilesY * config.urls.length

const padLeft = (num) => String(num).padStart(String(totalNumTiles).length)
const fetchTiles = async () => {
  let tile = 1
  for (let i in config.urls) {
    const urlTemplate = config.urls[i]
    for (let z = zoomFrom; z <= zoomTo; z++) {
      const centerLat = lat2tile(lat, z)
      const centerLng = lng2tile(lng, z)
      const minX = centerLng - Math.floor((numTilesX - 1) / 2)
      const maxX = minX + numTilesX + 1
      const minY = centerLat - Math.floor((numTilesX - 1) / 2)
      const maxY = minY + numTilesY + 1
      console.log(
        chalk.inverse(
          '⚑ ' +
          urlTemplate
            .replace('{z}', z)
            .replace('{x}', `${minX}-${maxX}`)
            .replace('{y}', `${minY}-${maxY}`),
        ),
      )
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const zf = Math.floor(z)
          const url =
            tilesBaseUrl + urlTemplate.replace('{z}', zf).replace('{x}', x).replace('{y}', y)
          console.log(
            `🡇 ${padLeft(tile++)}/${totalNumTiles} - ${Math.floor(zf)}/${x}/${y} - ${url}`,
          )
          const start = new Date()
          const response = await fetch(url)
          let duration = formatDuration(new Date() - start)
          const statusFormatted = `${response.status} - ${response.statusText}`
          if (response.status === 200) {
            const cacheStatus = response.headers.get('x-cache-status') || 'NO-CACHE'
            const contentLength = formatBytes(response.headers.get('content-length'))
            console.log(chalk.green('✓'), `${cacheStatus} - ${duration} - ${contentLength}`)
          } else if (response.status < 300) {
            console.log(chalk.yellow(`⚠ ${statusFormatted}`))
          } else {
            console.log(chalk.red(`⚠ ${statusFormatted}`))
          }
        }
      }
    }
  }
  process.exit(0)
}

fetchTiles()

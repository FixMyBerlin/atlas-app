#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

import { lat2tile, lng2tile, formatBytes, formatDuration, log } from './util.js'

dotenv.config()
dotenv.config({ path: `.env.local`, override: true })
const tilesBaseUrl = `https://${process.env.TILES_URL}`
const cacheWarmingConfigPath = 'config.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
log(path.join(__dirname, cacheWarmingConfigPath))

log(`Loading config ${cacheWarmingConfigPath}...`)
const config = JSON.parse(fs.readFileSync(path.join(__dirname, cacheWarmingConfigPath), 'utf8'))

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
      const minY = centerLat - Math.floor((numTilesY - 1) / 2)
      const maxY = minY + numTilesY + 1
      log(
        chalk.inverse(
          '⚑ ' +
            urlTemplate
              .replace('{z}', z)
              .replace('{x}', `${minX}-${maxX}`)
              .replace('{y}', `${minY}-${maxY}`)
        )
      )
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const zf = Math.floor(z)
          const url =
            tilesBaseUrl + urlTemplate.replace('{z}', zf).replace('{x}', x).replace('{y}', y)
          log(`🡇 ${padLeft(tile++)}/${totalNumTiles} - ${Math.floor(zf)}/${x}/${y} - ${url}`)
          const start = new Date()
          const response = await fetch(url)
          let duration = formatDuration(new Date() - start)
          const statusFormatted = `${response.status} - ${response.statusText}`
          if (response.status === 200) {
            const cacheStatus = response.headers.get('x-cache-status') || 'NO-CACHE'
            const contentLength = formatBytes(response.headers.get('content-length'))
            log(chalk.green('✓'), `${cacheStatus} - ${duration} - ${contentLength}`)
          } else if (response.status < 300) {
            log(chalk.yellow(`⚠ ${statusFormatted}`))
          } else {
            log(chalk.red(`⚠ ${statusFormatted}`))
          }
        }
      }
    }
  }
  process.exit(0)
}

fetchTiles()

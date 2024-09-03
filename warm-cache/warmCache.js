#!/usr/bin/env node

import chalk from 'chalk'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

import { getTilesBounds, createTileUrl } from './util.js'
import { checkFile, log, formatBytes, formatDuration, readJson } from './util.js'
import { program, Option } from 'commander'

dotenv.config()
dotenv.config({ path: `.env`, override: true })
const tilesBaseUrl = `https://${process.env.TILES_URL}`

// prettier-ignore
{
program
  .name('warmCache')
  .description('Fetches tiles defined by a config file.')
  .addOption(new Option('-c, --config <json>', 'read config from <json>').argParser(checkFile).default('./config.json'))
}
program.parse(process.argv)
const opts = program.opts()

const config = readJson(opts.config)
log('ℹ Using config', opts.config)
log('ℹ Config =', JSON.stringify(config)) // for visualizeLog.js

const {
  viewport: screen,
  map: { lat, lng },
} = config
const zoomFrom = Math.floor(config.map.zoomFrom)
const zoomTo = Math.floor(config.map.zoomTo)
const center = { lat, lng }

const totalNumTiles = 1000 // TODO
const padLeft = (num) => String(num).padStart(String(totalNumTiles).length)

let tile = 1
// ========== url ==========
for (let i in config.urls) {
  const urlTemplate = config.urls[i]
  // ========== zoom ==========
  for (let z = zoomFrom; z <= zoomTo; z++) {
    const { x0, y0, x1, y1 } = getTilesBounds(screen, center, z)
    log(chalk.inverse('⚑ ' + createTileUrl('', urlTemplate, `${x0}-${x1}`, `${y0}-${y1}`, z)))
    // ========== tile x ==========
    for (let x = x0; x <= x1; x++) {
      // ========== tile y ==========
      for (let y = y0; y <= y1; y++) {
        const url = createTileUrl(tilesBaseUrl, urlTemplate, x, y, z)
        log(`🡇 ${padLeft(tile++)}/${totalNumTiles} - ${z}/${x}/${y} - ${url}`)
        const start = new Date()
        const response = await fetch(url)
        const duration = formatDuration(new Date() - start)
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

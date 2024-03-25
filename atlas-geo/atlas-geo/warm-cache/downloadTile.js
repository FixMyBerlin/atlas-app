#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { program, Argument } from 'commander'
import { VectorTile } from '@mapbox/vector-tile'
import Protobuf from 'pbf'

import { error, fileExists, folderExists } from './util.js'

program
  .name('downloadTile')
  .description('Downloads a vector tile from <url> and saves it as .geojson in <folder>')
program.addArgument(new Argument('<url>'))
program.addArgument(new Argument('<folder>'))
program.parse(process.argv)

const [url, folder] = program.args
if (!folderExists(folder)) error(`Folder "${folder}" does not exist.`)
const name = new URL(url).pathname.slice(1).replaceAll('/', '-')
const mvt = `${folder}/${name}.mvt`
const geojson = `${folder}/${name}.geojson`

const log = (arg) => process.stderr.write(arg + '\n')

if (fileExists(geojson)) {
  log(`File "${geojson}" exists.`)
} else {
  log(`Downloading ${url}...`)
  await downloadFile(url, mvt)
  log(`Saved tile to "${mvt}"`)
  log(`Converting to geojson...`)
  const layers = await convertToGeojson(mvt)
  fs.writeFileSync(geojson, JSON.stringify(layers, null, 2))
  log(`Saved geojson to "${geojson}"`)
}

console.log(geojson)

// ================================================================================

async function downloadFile(url, filePath) {
  const response = await fetch(url)
  if (!response.ok) error(`Failed to download file: ${response.statusText}`)
  const fileStream = fs.createWriteStream(filePath)
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream)
    response.body.on('error', (err) => reject(err))
    fileStream.on('finish', () => resolve())
  })
}

async function convertToGeojson(tileFile) {
  const [tileZ, tileX, tileY] = path
    .parse(tileFile)
    .name.split('-')
    .slice(-3)
    .map((s) => Number(s))

  const byteArray = fs.readFileSync(tileFile, null)
  const tile = new VectorTile(new Protobuf(byteArray))

  return Object.keys(tile.layers).map((layerName) => {
    const layer = tile.layers[layerName]
    const features = []
    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i).toGeoJSON(tileX, tileY, tileZ)
      features.push(feature)
    }
    return {
      name: layerName,
      type: 'FeatureCollection',
      features: features,
    }
  })
}

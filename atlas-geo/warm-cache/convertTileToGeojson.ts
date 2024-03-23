#!/usr/bin/env bun

import fs from 'node:fs'
import { parseArgs } from 'node:util'
import { VectorTile } from '@mapbox/vector-tile'
import Protobuf from 'pbf'

import { displaySortLogHelp, error } from './util'
import path from 'path'

let parsed: any
try {
  parsed = parseArgs({
    options: {
      help: { type: 'boolean', default: false },
    },
    strict: true,
    allowPositionals: true,
  })
} catch (e) {
  error(e.message)
}

const { values, positionals } = parsed

if (values.help) {
  displaySortLogHelp()
  process.exit(0)
}

if (positionals.length === 0) error('Vector tile filename is missing.')
if (positionals.length > 1) error('Too many arguments.')
const filename = positionals[0]
if (!filename.endsWith('.mvt')) error('File is not a .mvt')
if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)

const [tileZ, tileX, tileY] = path
  .parse(filename)
  .name.split('-')
  .slice(-3)
  .map((s) => Number(s))

const file = Bun.file(filename)
const arrBuffer = await file.arrayBuffer()
const byteArray = new Uint8Array(arrBuffer)
const tile = new VectorTile(new Protobuf(byteArray))

const layers = Object.keys(tile.layers).map((layerName) => {
  const layer = tile.layers[layerName]
  const features: Record<string, any>[] = []
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

const outputFile = filename.split('.')[0] + '.geojson'
fs.writeFileSync(outputFile, JSON.stringify(layers, null, 2))

console.log(outputFile)

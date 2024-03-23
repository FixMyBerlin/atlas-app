#!/usr/bin/env bun

import fs from 'node:fs'
import path from 'path'
import { VectorTile } from '@mapbox/vector-tile'
import Protobuf from 'pbf'

const filename = process.argv[2]

const [tileZ, tileX, tileY] = path
  .parse(filename!)
  .name.split('-')
  .slice(-3)
  .map((s) => Number(s))

const file = Bun.file(filename!)
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

const outputFile = filename!.split('.')[0] + '.geojson'
fs.writeFileSync(outputFile, JSON.stringify(layers, null, 2))

console.log(outputFile)

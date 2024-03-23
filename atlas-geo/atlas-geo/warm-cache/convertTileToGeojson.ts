#!/usr/bin/env bun

import fs from 'node:fs'
import path from 'path'
import { VectorTile } from '@mapbox/vector-tile'
import Protobuf from 'pbf'

const [inputFile, outputFile] = process.argv.slice(2)

const [tileZ, tileX, tileY] = path
  .parse(inputFile!)
  .name.split('-')
  .slice(-3)
  .map((s) => Number(s))

const file = Bun.file(inputFile!)
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

fs.writeFileSync(outputFile!, JSON.stringify(layers, null, 2))

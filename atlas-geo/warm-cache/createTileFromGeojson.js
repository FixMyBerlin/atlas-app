#!/usr/bin/env node

import fs from 'fs'
import geojsonvt from 'geojson-vt'

// build an initial index of tiles
const geojson = JSON.parse(fs.readFileSync('tiles/roads-8-138-85.geojson', 'utf-8'))
var tileIndex = geojsonvt(geojson)

// request a particular tile
var features = tileIndex.getTile(z, x, y).features

// show an array of tile coordinates created so far
console.log(tileIndex.tileCoords) // [{z: 0, x: 0, y: 0}, ...]

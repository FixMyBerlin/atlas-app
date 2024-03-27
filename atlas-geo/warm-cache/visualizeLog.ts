#!/usr/bin/env bun

import { program, Argument } from 'commander'
import GeoJSON from 'geojson'

import { checkFile, getLogData, isError, tile2bbox, writeJson, unproject, createBox } from './util'
import { formatBytes, formatDuration } from './util'
import { isRequest, parseResponse, parseSourceAndZoom, parseRequest } from './util'

// prettier-ignore
{
program
  .name('visulizeLog')
  .description('Creates a <geojson> from <logfile> visualizing screen size, requests and responses')
program.addArgument(new Argument('<logfile>').argParser(checkFile))
program.addArgument(new Argument('<geojson>'))
}
program.parse(process.argv)
const opts = program.opts()

// ================================================================================

const [logfile, geojsonFile] = program.args
const logData = await getLogData(logfile)

const fragment = 'ℹ Config = '
const configLine = logData.find((line) => line.search(fragment) !== -1)
let config: any = null
if (!configLine) {
  console.warn('logfile does not contain a config.')
} else {
  // @ts-ignore
  config = JSON.parse(configLine.split(fragment)[1])
}

const polygons: any = []
let i = 0
while (i < logData.length) {
  const line = logData[i]!

  if (config) {
    const sourceAndZoom = parseSourceAndZoom(line)
    if (sourceAndZoom) {
      const { zoom } = sourceAndZoom
      addScreenBox(zoom)
    }
  }

  if (!isRequest(line)) {
    i++
    continue
  }
  let request = line

  const response = logData[i + 1]!
  if (!response) break

  const { x, y, z } = parseRequest(request)

  let properties
  if (isError(response)) {
    // TODO - improve this!
    properties = {
      error: response,
      stroke: 'red',
    }
  } else {
    const { cacheStatus, size, time } = parseResponse(response)
    properties = {
      cacheStatus,
      size: formatBytes(size, false),
      time: formatDuration(time, false),
      stroke: 'green',
    }
  }

  const [x0, y0, x1, y1] = tile2bbox(x, y, z)
  addBox(
    [
      [x0, y0],
      [x1, y1],
    ],
    {
      type: 'tile',
      ...properties,
    },
  )

  i += 2
}

function addBox(box, properties) {
  const [[x0, y0], [x1, y1]] = box
  polygons.push({
    polygon: createBox(x0, y0, x1, y1),
    ...properties,
    '==========': '==========', // for better display in https://geojson.io/
    stroke: '#555555',
    'stroke-width': 2,
    'stroke-opacity': 1,
    fill: '#555555',
    'fill-opacity': 0,
    ...properties,
  })
}
//
function addScreenBox(zoom) {
  // @ts-ignore
  const {
    viewport: screen,
    map: { lat, lng },
  } = config
  const [[x0, y0], [x1, y1]] = unproject(screen, { lat, lng }, zoom, [
    [0, 0],
    [screen.width, screen.height],
  ])
  addBox(
    // prettier-ignore
    [[x0, y0], [x1, y1]],
    { type: 'screen', zoom, stroke: 'black' },
  )
}

// @ts-ignore
const geojson = GeoJSON.parse(polygons, { Polygon: 'polygon' })
writeJson(geojson, geojsonFile)

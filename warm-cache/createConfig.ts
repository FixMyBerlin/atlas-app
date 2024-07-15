#!/usr/bin/env bun

import { sources } from '../../atlas-app/src/processing/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { staticRegion } from '../../atlas-app/src/processing/regionen/(index)/_data/regions.const'
import { getTilesUrl } from '../../atlas-app/src/processing/_components/utils/getTilesUrl'

const regionSlug = 'bb'
const cacheWarmingConfigPath = 'config.json'

const viewport = {
  width: 800,
  height: 600,
}

const zoomOutLevels = 0
const zoomInLevels = 0

const region = staticRegion.find((region) => region.slug === regionSlug)

const tilesUrl = getTilesUrl()
const urls = sources
  .map((source) => {
    return source.tiles
  })
  .filter((url) => url.startsWith(tilesUrl) && url.endsWith('{z}/{x}/{y}'))
  .map((url) => {
    return url.replace(tilesUrl, '')
  })

const data = {
  viewport,
  map: {
    lat: region!.map.lat,
    lng: region!.map.lng,
    zoomFrom: region!.map.zoom - zoomOutLevels,
    zoomTo: region!.map.zoom + zoomInLevels,
  },
  urls,
}

const config = JSON.stringify(data, null, 2)
Bun.write(cacheWarmingConfigPath, config)

console.log(`${cacheWarmingConfigPath} saved.`)
console.log(config)

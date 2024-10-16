import { URL } from 'node:url'
import { generalizationFunctionIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/generalizationIdentifier'
import { TableId } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/tables.const'

function lng2X(lng: number, z: number): number {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, z))
}

function lat2Y(lat: number, z: number): number {
  return Math.floor(
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2) *
      Math.pow(2, z),
  )
}

function bbox2Tiles(
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number,
  z: number,
): { minX: number; minY: number; maxX: number; maxY: number } {
  let [minX, maxX] = [lng2X(minLng, z), lng2X(maxLng, z)]
  let [minY, maxY] = [lat2Y(minLat, z), lat2Y(maxLat, z)]
  if (minX > maxX) {
    ;[minX, maxX] = [maxX, minX]
  }
  if (minY > maxY) {
    ;[minY, maxY] = [maxY, minY]
  }
  return { minX, maxX, minY, maxY }
}

export async function warmCache(
  {
    min: [minLng, minLat],
    max: [maxLng, maxLat],
  }: {
    min: readonly [number, number]
    max: readonly [number, number]
  },
  minZoom: number,
  maxZoom: number,
  tables: TableId[],
): Promise<void> {
  const zoomDelta = maxZoom - minZoom + 1
  const { minX, minY, maxX, maxY } = bbox2Tiles(minLng, minLat, maxLng, maxLat, minZoom)
  const tileFactor = (Math.pow(4, zoomDelta) - 1) / 3
  let tilesOnLevel = (maxX - minX + 1) * (maxY - minY + 1)
  const tilesTotal = tilesOnLevel * tileFactor
  console.log(`Warming cache for ${zoomDelta} zoom levels`)
  console.log(`Upper bound for tiles is ${tilesTotal}`)

  for (let z = minZoom; z <= maxZoom; z++) {
    const { minX, minY, maxX, maxY } = bbox2Tiles(minLng, minLat, maxLng, maxLat, z)
    const tilesDiff = tilesOnLevel - (maxX - minX + 1) * (maxY - minY + 1)
    console.log(
      `Zoom level ${z}: Skipping ${tilesDiff} tiles, because they are not inside the given bbox`,
    )
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const responses = await Promise.all(
          tables.map((tableId) => {
            const tileUrl = new URL(
              `http://staging-tiles.radverkehrsatlas.de/${generalizationFunctionIdentifier(tableId)}/${z}/${x}/${y}`,
            )
            // console.log(tileUrl.toString())
            return fetch(tileUrl.toString(), { method: 'HEAD' })
          }),
        )
        // console.log(responses)
        responses.map((response) => {
          console.log(response.url)
          console.log(response.headers.get('x-cache-status'))
        })
      }
    }
    tilesOnLevel = (maxX - minX + 1) * (maxY - minY + 1) * 4
  }
}

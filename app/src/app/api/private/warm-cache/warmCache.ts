import { padStart } from 'lodash'
import { URL } from 'node:url'
import { getTilesUrl } from 'src/app/_components/utils/getTilesUrl'
import { generalizationFunctionIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/generalizationIdentifier'
import {
  TableId,
  UnionTiles,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/tables.const'

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

function tileFactor(zoomDelta: number) {
  return (Math.pow(4, zoomDelta) - 1) / 3
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
  tables: UnionTiles<TableId>[],
) {
  const { minX, minY, maxX, maxY } = bbox2Tiles(minLng, minLat, maxLng, maxLat, minZoom)
  const nTilesTopLevel = (maxX - minX + 1) * (maxY - minY + 1)
  const nTilesTotal = nTilesTopLevel * tileFactor(maxZoom - minZoom + 1)

  for (let z = minZoom; z <= maxZoom; z++) {
    const { minX, minY, maxX, maxY } = bbox2Tiles(minLng, minLat, maxLng, maxLat, z)
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        await Promise.all(
          tables.map((tableId) => {
            const tileUrl = new URL(
              `${getTilesUrl()}/${generalizationFunctionIdentifier(tableId)}/${z}/${x}/${y}`,
            )
            return fetch(tileUrl.toString(), { method: 'HEAD' })
          }),
        )
      }
    }

    const nTilesWarmed = padStart(
      `${nTilesTopLevel * tileFactor(z - minZoom + 1)}`,
      nTilesTotal.toString().length,
    )
    console.log(`   warmed ${nTilesWarmed}/${nTilesTotal} tiles`)
  }
}

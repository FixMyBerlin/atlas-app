import { getApiUrl } from '@components/utils'
import { SourceExportApiIdentifier } from '../mapData'
import { Region } from '@fakeServer/regions.const'

export const exportApiUrlBbox = (
  apiIdentifier: SourceExportApiIdentifier,
  bbox: NonNullable<Region['bbox']>,
) => {
  return `${getApiUrl()}/export/${apiIdentifier}?minlon=${bbox.min[0]}&minlat=${
    bbox.min[1]
  }&maxlon=${bbox.max[0]}&maxlat=${bbox.max[1]}`
}

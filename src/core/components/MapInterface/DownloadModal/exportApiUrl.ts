import { getApiUrl } from 'src/core/utils'
import { SourceExportApiIdentifier } from '../mapData'
import { Region } from 'src/regions/components/additionalRegionAttributes.const'

export const exportApiUrlBbox = (
  apiIdentifier: SourceExportApiIdentifier,
  bbox: NonNullable<Region['bbox']>,
) => {
  const url = new URL(`${getApiUrl()}/export/${apiIdentifier}`)
  url.searchParams.append('minlon', String(bbox.min[0]))
  url.searchParams.append('minlat', String(bbox.min[1]))
  url.searchParams.append('maxlon', String(bbox.max[0]))
  url.searchParams.append('maxlat', String(bbox.max[1]))

  return url.href
}

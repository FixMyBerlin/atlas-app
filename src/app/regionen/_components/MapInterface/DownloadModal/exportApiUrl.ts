'use client'

import { AdditionalRegionAttributes } from 'src/regions/components/additionalRegionAttributes.const'
import { SourceExportApiIdentifier } from '../mapData/sourcesMapData/sources.const'
import { getApiUrl } from 'src/app/_components/utils/getApiUrl'

export const exportApiUrlBbox = (
  apiIdentifier: SourceExportApiIdentifier,
  bbox: NonNullable<AdditionalRegionAttributes['bbox']>,
) => {
  const url = new URL(`${getApiUrl()}/export/${apiIdentifier}`)
  url.searchParams.append('minlon', String(bbox.min[0]))
  url.searchParams.append('minlat', String(bbox.min[1]))
  url.searchParams.append('maxlon', String(bbox.max[0]))
  url.searchParams.append('maxlat', String(bbox.max[1]))

  return url.href
}

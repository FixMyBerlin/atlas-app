import { getExportApiUrl } from 'src/app/_components/utils/getExportApiUrl'
import { SourceExportApiIdentifier } from 'src/regions/data/map/sources/categorySources.const'
import { StaticRegionData } from 'src/regions/data/regions.const'

export const exportApiUrlBbox = (
  apiIdentifier: SourceExportApiIdentifier,
  bbox: NonNullable<StaticRegionData['bbox']>,
) => {
  const url = new URL(`${getExportApiUrl()}/export/${apiIdentifier}`)
  url.searchParams.append('minlon', String(bbox.min[0]))
  url.searchParams.append('minlat', String(bbox.min[1]))
  url.searchParams.append('maxlon', String(bbox.max[0]))
  url.searchParams.append('maxlat', String(bbox.max[1]))

  return url.href
}

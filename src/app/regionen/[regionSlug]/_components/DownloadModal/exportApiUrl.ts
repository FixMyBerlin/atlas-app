import { StaticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { SourceExportApiIdentifier } from '../../_mapData/mapDataSources/sources.const'
import { getExportApiUrl } from 'src/app/_components/utils/getExportApiUrl'

export const exportApiUrlBbox = (
  apiIdentifier: SourceExportApiIdentifier,
  bbox: NonNullable<StaticRegion['bbox']>,
) => {
  const url = new URL(`${getExportApiUrl()}/export/${apiIdentifier}`)
  url.searchParams.append('minlon', String(bbox.min[0]))
  url.searchParams.append('minlat', String(bbox.min[1]))
  url.searchParams.append('maxlon', String(bbox.max[0]))
  url.searchParams.append('maxlat', String(bbox.max[1]))

  return url.href
}

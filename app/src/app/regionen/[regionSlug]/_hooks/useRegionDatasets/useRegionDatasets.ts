import { useQuery } from '@blitzjs/rpc'
import memoize from 'lodash/memoize'
import { MetaData } from 'scripts/StaticDatasets/types'
import getUploadsForRegion from 'src/uploads/queries/getUploadsForRegion'
import { getStaticDatasetUrl } from '../../../../_components/utils/getStaticDatasetUrl'
import { useRegionSlug } from '../../_components/regionUtils/useRegionSlug'
import { Prettify } from 'src/app/_components/types/types'

type RegionDataset = Prettify<
  MetaData['configs'][number] & {
    isPublic: boolean
    id: string
    url: string
    type: 'PMTILES' | 'GEOJSON'
    githubUrl: string // an addition to MetaData['configs'] in updateStaticDatasets.ts
  }
>

const getDatasets = memoize(
  (uploads) => {
    const regionDatasets: RegionDataset[] = []
    uploads.forEach((upload) => {
      upload.configs.forEach((config) => {
        regionDatasets.push({
          ...config,
          isPublic: upload.public,
          id: upload.slug,
          type: upload.type,
          url: getStaticDatasetUrl(upload.slug),
        })
      })
    })
    return regionDatasets
  },
  (uploads) => uploads.map((upload) => upload.id).join(),
)

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const [uploads] = useQuery(
    getUploadsForRegion,
    { regionSlug: regionSlug! },
    { cacheTime: Infinity },
  )
  return getDatasets(uploads)
}

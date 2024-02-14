import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { useQuery } from '@blitzjs/rpc'
import getUploadsForRegion from 'src/uploads/queries/getUploadsForRegion'
import { sourceStaticDatasetIdUrl } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sourcesDatasets/utils/sourceDatasetIdUrl'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const [uploads] = useQuery(getUploadsForRegion, { regionSlug: regionSlug! })
  const regionDatasets: any[] = []
  uploads.forEach((upload) => {
    const url = sourceStaticDatasetIdUrl(upload.slug).url
    // @ts-expect-error
    upload.configs.forEach((config) => {
      regionDatasets.push({
        ...config,
        id: upload.slug,
        // regionKey: upload.regions.map((r) => r.slug),
        url,
      })
    })
  })

  return regionDatasets
}

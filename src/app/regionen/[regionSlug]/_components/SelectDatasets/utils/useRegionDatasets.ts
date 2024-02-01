import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { useQuery } from '@blitzjs/rpc'
import getUploadsForRegion from 'src/uploads/queries/getUploadsForRegion'
import { sourceStaticDatasetIdUrl } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sourcesDatasets/utils/sourceDatasetIdUrl'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const [uploads] = useQuery(getUploadsForRegion, { regionSlug: regionSlug! })
  const regionDatasets = uploads.map((upload) => {
    return {
      // @ts-ignore TS2698: Spread types may only be created from object types.
      ...upload.config,
      id: upload.slug,
      // regionKey: upload.regions.map((r) => r.slug),
      url: sourceStaticDatasetIdUrl(upload.slug).url,
    }
  })

  return regionDatasets
}

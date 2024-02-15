import { useQuery } from '@blitzjs/rpc'
import getUploadsForRegion from 'src/uploads/queries/getUploadsForRegion'
import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { sourceStaticDatasetIdUrl } from './sourceDatasetIdUrl'

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
        url,
      })
    })
  })

  return regionDatasets.sort((a, b) => b.name.localeCompare(a.name))
}

import { useQuery } from '@blitzjs/rpc'
import getUploadsForRegion from 'src/uploads/queries/getUploadsForRegion'
import { getStaticDatasetUrl } from '../../../../_components/utils/getStaticDatasetUrl'
import { useRegionSlug } from '../../_components/regionUtils/useRegionSlug'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const [uploads] = useQuery(getUploadsForRegion, { regionSlug: regionSlug! })

  const regionDatasets: any[] = []
  uploads.forEach((upload) => {
    // @ts-expect-error
    upload.configs.forEach((config) => {
      regionDatasets.push({
        ...config,
        isPublic: upload.public,
        id: upload.slug,
        url: getStaticDatasetUrl(upload.slug),
      })
    })
  })

  return regionDatasets.sort((a, b) => a.name.localeCompare(b.name))
}

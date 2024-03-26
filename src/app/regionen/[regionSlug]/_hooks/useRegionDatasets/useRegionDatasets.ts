import { useQuery } from '@blitzjs/rpc'
import { MetaData } from 'scripts/StaticDatasets/types'
import getUploadsForRegion from 'src/uploads/queries/getUploadsForRegion'
import { getStaticDatasetUrl } from '../../../../_components/utils/getStaticDatasetUrl'
import { useRegionSlug } from '../../_components/regionUtils/useRegionSlug'
import { Prettify } from 'src/app/_components/types/types'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const [uploads] = useQuery(getUploadsForRegion, { regionSlug: regionSlug! })

  type RegionDataset = Prettify<
    MetaData['configs'][number] & {
      isPublic: boolean
      id: string
      url: string
    }
  >
  const regionDatasets: RegionDataset[] = []
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

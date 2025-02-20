import { useAtlasFilterParam } from '@/src/app/regionen/[regionSlug]/_hooks/useQueryState/useNotesAtlasParams'
import getNotesAndCommentsForRegion from '@/src/server/notes/queries/getNotesAndCommentsForRegion'
import { getQueryKey } from '@blitzjs/rpc'
import { useStaticRegion } from '../../../regionUtils/useStaticRegion'

export const useQueryKey = () => {
  const region = useStaticRegion()!
  const { atlasNotesFilterParam } = useAtlasFilterParam()
  return getQueryKey(getNotesAndCommentsForRegion, {
    regionSlug: region.slug,
    filter: atlasNotesFilterParam,
  })
}

import { useHasPermissions } from 'src/app/_hooks/useHasPermissions'
import { useStaticRegion } from '../../../regionUtils/useStaticRegion'

export const useAllowAtlasNotes = () => {
  const hasPermissions = useHasPermissions()
  const region = useStaticRegion()
  return region && region.notes === 'atlasNotes' && hasPermissions
}

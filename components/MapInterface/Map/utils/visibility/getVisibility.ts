import { SelectedSources } from '@/components/MapInterface/store/handleAddRemove'
import { sourcesList } from '../../sources.const'
import { ScopeForId } from '../scopedId/types'

export const layerVisibility = (visibile: boolean) =>
  visibile ? 'visible' : 'none'

export const getVisibility = (active: string, scope: ScopeForId['scope']) =>
  active === scope ? 'visible' : 'none'

export const getSourceVisibility = (
  sources: SelectedSources,
  sourceToCheck: keyof typeof sourcesList
) => (sources?.includes(sourceToCheck) ? 'visible' : 'none')

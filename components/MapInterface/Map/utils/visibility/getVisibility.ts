import { StoreSelectedSources } from '@/components/MapInterface/store'
import { sourcesList } from '../../sources.const'
import { ScopeForId } from '../scopedId/types'

export const layerVisibility = (visibile: boolean) =>
  visibile ? 'visible' : 'none'

export const getVisibility = (active: string, scope: ScopeForId['scope']) =>
  active === scope ? 'visible' : 'none'

export const getSourceVisibility = (
  sources: StoreSelectedSources['selectedSources'],
  sourceToCheck: keyof typeof sourcesList
) => (sources?.includes(sourceToCheck) ? 'visible' : 'none')

import { ScopeForId } from './types'

export const scopedId = (scope: ScopeForId['scope'], part: string) =>
  `${scope}-${part}`

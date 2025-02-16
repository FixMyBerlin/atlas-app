import { globalSecondaryNavigation } from '../HeaderApp/navigation.const'
import { PrimaryNavigation, SecondaryNavigation } from '../types'

export const defaultPrimaryNavigation: PrimaryNavigation[] = [
  // { name: 'Atlas', href: '/regionen/:regionPath/' },
  // { name: 'Mitmachen', href: '/regionen/:regionPath/mitmachen' },
  // { name: 'Planungen', href: '#todo-planungen' },
  // { name: 'Analysen', href: '#tood-analysen' },
]

export const defaultSecondaryNavigationGrouped: SecondaryNavigation[][] = [
  [{ name: 'Startseite', href: '/' }, ...globalSecondaryNavigation],
]

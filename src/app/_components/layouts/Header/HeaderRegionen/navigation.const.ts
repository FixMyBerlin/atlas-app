import { defaultSecondaryNavigation } from '../HeaderApp/navigation.const'
import { PrimaryNavigation, SecondaryNavigation } from '../types'

export const primaryNavigation: PrimaryNavigation[] = [
  // { name: 'Atlas', href: '/regionen/:regionPath/' },
  // { name: 'Mitmachen', href: '/regionen/:regionPath/mitmachen' },
  // { name: 'Planungen', href: '#todo-planungen' },
  // { name: 'Analysen', href: '#tood-analysen' },
]

export const secondaryNavigationGrouped: SecondaryNavigation[][] = [
  [{ name: 'Startseite', href: '/' }, ...defaultSecondaryNavigation],
]

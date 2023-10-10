'use client'

import { defaultSecondaryNavigation } from '../HeaderApp/navigation.const'

export const primaryNavigation = [
  // { name: 'Atlas', href: '/regionen/:regionPath/' },
  // { name: 'Mitmachen', href: '/regionen/:regionPath/mitmachen' },
  // { name: 'Planungen', href: '#todo-planungen' },
  // { name: 'Analysen', href: '#tood-analysen' },
]

export const secondaryNavigationGrouped = [
  [{ name: 'Startseite', href: '/' }, ...defaultSecondaryNavigation],
]

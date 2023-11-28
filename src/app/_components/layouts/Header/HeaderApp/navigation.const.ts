import { PrimaryNavigation, SecondaryNavigation } from '../types'

export const primaryNavigation: PrimaryNavigation[] = [
  { name: 'Start', href: '/' },
  { name: 'Regionen', href: '/regionen' },
  // { name: 'Über', href: '/ueber' },
]

export const defaultSecondaryNavigation: SecondaryNavigation[] = [
  { name: 'Feedback', href: '/kontakt#feedback' },
  { name: 'Datenschutz', href: '/datenschutz' },
  { name: 'Kontakt & Impressum', href: '/kontakt' },
]

export const secondaryNavigationGrouped: SecondaryNavigation[][] = [[...defaultSecondaryNavigation]]

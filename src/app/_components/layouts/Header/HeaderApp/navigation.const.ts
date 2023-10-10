'use client'

export const primaryNavigation = [
  { name: 'Start', href: '/' },
  { name: 'Regionen', href: '/regionen' },
  // { name: 'Über', href: '/ueber' },
]

export const defaultSecondaryNavigation = [
  { name: 'Feedback', href: '/kontakt#feedback' },
  { name: 'Datenschutz', href: '/datenschutz' },
  { name: 'Kontakt & Impressum', href: '/kontakt' },
]

export const secondaryNavigationGrouped = [[...defaultSecondaryNavigation]]

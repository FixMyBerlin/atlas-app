// On Mobile, both Navigationlists are combined in <MobileMenu>

export const primaryNavigation = [
  { name: 'Daten', href: '#', current: true },
  { name: 'Planungen', href: '#', current: false },
  { name: 'Analysen', href: '#', current: false },
]

export const secondaryNavigationGrouped = [
  [
    { name: 'Einstellung', href: '#', current: false },
    { name: 'Abmelden', href: '#', current: false },
  ],
  [
    { name: 'Feedback', href: '#feedback', current: false },
    { name: 'Datenschutz', href: '/privacy-policy', current: false },
    { name: 'Kontakt & Impressum', href: '/contact', current: false },
  ],
]

import { Route } from 'next'

export type FooterMenuItem = {
  name: string
  to: Route
}

export const footerLinks: FooterMenuItem[] = [
  { name: 'Start', to: '/' },
  { name: 'Regionen', to: '/regionen' },
  { name: 'Kontakt & Impressum', to: '/kontakt' },
  { name: 'Datenschutz', to: '/datenschutz' },
]

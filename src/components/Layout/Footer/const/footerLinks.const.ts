export type FooterMenuItem = {
  name: string
  to: string
}
const pages: FooterMenuItem[] = [
  { name: 'Start', to: '/' },
  { name: 'Über', to: '/ueber-uns' },
]

const legal: FooterMenuItem[] = [
  { name: 'Impressum', to: '/impressum/' },
  { name: 'Kontakt', to: '/kontakt/' },
  { name: 'Datenschutz', to: '/datenschutz/' },
]

export const footerLinks: { [key: string]: FooterMenuItem[] } = {
  pages,
  legal,
}

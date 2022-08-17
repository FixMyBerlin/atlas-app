export type FooterMenuItem = {
  name: string
  to: string
}
const pages: FooterMenuItem[] = [{ name: 'Start', to: '/' }]

const legal: FooterMenuItem[] = [
  { name: 'Kontakt & Impressum', to: '/kontakt/' },
  { name: 'Datenschutz', to: '/datenschutz/' },
]

export const footerLinks: { [key: string]: FooterMenuItem[] } = {
  pages,
  legal,
}

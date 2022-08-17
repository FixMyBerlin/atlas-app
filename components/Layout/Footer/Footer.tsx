import React from 'react'
import { Logo } from '../Logo'
import { FooterLinkList } from './FooterLinkList'
import { footerLinks } from './footerLinks.const'

export const Footer: React.FC = () => {
  const { pages, legal } = footerLinks
  return (
    <footer
      className="bg-dark-gray z-0 pt-6 pb-12"
      aria-labelledby="footer-heading"
    >
      <div className="flex flex-row">
        <div className="px-[3vw]">
          <Logo />
        </div>
        <FooterLinkList linkList={pages} className="flex-grow px-[3vw]" />
        <FooterLinkList
          linkList={legal}
          className="ml-auto flex-none pr-[15vw]"
        />
      </div>
    </footer>
  )
}

import { MapIcon } from '@heroicons/react/24/outline'
import { FooterLinkList } from './FooterLinkList'
import { footerLinks } from './footerLinks.const'

export const Footer: React.FC = () => {
  return (
    <footer className="z-0 bg-gray-800 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 sm:flex-row sm:px-6 lg:mx-20 lg:px-8">
        <div className="flex items-center">
          <MapIcon className="h-8 w-auto text-yellow-400" />
          <span className="ml-2 text-gray-400">TILDA</span>
        </div>
        <FooterLinkList linkList={footerLinks} className="" />
      </div>
    </footer>
  )
}

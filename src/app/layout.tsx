'use client'

import { BlitzProvider } from 'src/blitz-client'
import { MetaTagProvider } from './_components/layouts/MetaTags/MetaTagProvider'
import { MetaTags } from './_components/layouts/MetaTags/MetaTags'
import { TailwindResponsiveHelper } from './_components/layouts/TailwindResponsiveHelper/TailwindResponsiveHelper'
import './_components/layouts/global.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MetaTagProvider>
      <html lang="de" className="h-full">
        <MetaTags />
        <body className="flex min-h-full w-full text-gray-800 antialiased">
          <BlitzProvider>
            <div className="relative flex-auto">{children}</div>
          </BlitzProvider>
          <TailwindResponsiveHelper />
        </body>
      </html>
    </MetaTagProvider>
  )
}

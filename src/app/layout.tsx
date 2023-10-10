'use client'

import { BlitzProvider } from 'src/blitz-client'
import './_components/layouts/global.css'
import { TailwindResponsiveHelper } from './_components/layouts/TailwindResponsiveHelper/TailwindResponsiveHelper'

// TODO: use react-helmet
// export const metadata: Metadata = {
//   title: 'Home',
//   description: 'Welcome to Next.js',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      {/* Remidner: With next/head we cannot add className via <html className> or <body className>. They will error with the false "next-head-count is missing" message */}
      <body className="flex min-h-full w-full text-gray-800 antialiased">
        <BlitzProvider>
          <div className="relative flex-auto">{children}</div>
        </BlitzProvider>
        <TailwindResponsiveHelper />
      </body>
    </html>
  )
}

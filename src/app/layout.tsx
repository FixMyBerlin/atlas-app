import { Metadata, Viewport } from 'next'
import SocialSharingImage from 'src/app/_components/layouts/assets/og-image-default.png'
import { BlitzProvider } from 'src/blitz-client'
import './_components/layouts/global.css'
import { MissingEnvError } from './_components/layouts/helper/MissingEnvError'
import { TailwindResponsiveHelper } from './_components/layouts/helper/TailwindResponsiveHelper'
import { isProd } from './_components/utils/isEnv'

// https://nextjs.org/docs/app/building-your-application/optimizing/metadata
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata

export const metadata: Metadata = {
  // 'noindex': No default on Production, but everyting is 'noindex' on Staging & Development
  // For testing, use ...{ robots: true ? undefined : 'noindex' },
  ...{ robots: isProd ? undefined : 'noindex' },
  title: {
    default: 'Radverkehrsatlas – Daten für die Radverkehrsplanung',
    template: '%s – radverkehrsatlas.de',
  },
  description:
    'Der Radverkehrsatlas beschleunigt die kommunale Radverkehrsplanung, mit umfassenden und amtlich nutzbaren Daten für die Radverkehrsplanung.',
  metadataBase: new URL('https://radverkehrsatlas.de'),
  openGraph: {
    images: [
      {
        url: SocialSharingImage.src,
        width: 1201,
        height: 631,
        alt: 'Karte des Radverkehrsatlas mit Radinfrastruktur und Optionen für weitere Themenkarten.',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@fixmyberlin',
    images: [SocialSharingImage.src],
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <body className="flex min-h-full w-full text-gray-800 antialiased">
        <BlitzProvider>
          <div className="relative flex-auto">{children}</div>
        </BlitzProvider>
        <MissingEnvError />
        <TailwindResponsiveHelper />
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  themeColor: '#27272a'
}

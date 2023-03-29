import { MetaTags } from '@components/MetaTags'
import { TailwindResponsiveHelper } from '@components/TailwindResponsiveHelper/TailwindResponsiveHelper'
import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import React from 'react'
import { Helmet } from 'react-helmet'
import { HeaderRegionen } from './Header'

type Props = {
  children?: React.ReactNode
}

// About h-screen-layout with Header: https://stackoverflow.com/a/64260554/729221
// About the custom Helmet classes see index.css. We set them here so they do not break our regular content pages.
export const LayoutMap: React.FC<Props> = ({ children }) => {
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  return (
    <>
      <Helmet>
        <html lang="de" className="fixed overflow-hidden" />
        <body className="fixed overflow-hidden" />
      </Helmet>
      <MetaTags noindex title={`Radverkehrsatlas (beta) ${region?.fullName}`} />
      <div className="flex h-screen flex-col">
        <HeaderRegionen />
        <main className="flex-grow">{children}</main>
      </div>
      <TailwindResponsiveHelper />
    </>
  )
}

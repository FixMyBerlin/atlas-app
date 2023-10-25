'use client'

import { HelmetProvider } from 'react-helmet-async'

export const MetaTagProvider = ({ children }) => {
  return <HelmetProvider>{children}</HelmetProvider>
}

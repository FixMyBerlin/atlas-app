import React from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

type Props = {
  children?: React.ReactNode
}

// Docs about nested layouts https://nextjs.org/docs/basic-features/layouts#per-page-layouts or more precicely https://nextjs.org/docs/basic-features/layouts#with-typescript
export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative flex flex-col h-full">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

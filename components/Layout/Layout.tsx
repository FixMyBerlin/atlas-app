import React from 'react'
import { Footer } from './Footer'

type Props = {
  children?: React.ReactNode
}

// Docs about nested layouts https://nextjs.org/docs/basic-features/layouts#per-page-layouts or more precicely https://nextjs.org/docs/basic-features/layouts#with-typescript
export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative flex h-full flex-col text-xl">
      <main>{children}</main>
      <Footer />
    </div>
  )
}

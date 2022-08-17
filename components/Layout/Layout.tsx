import React from 'react'
import { Footer } from './Footer'

type Props = {
  children?: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative flex h-full flex-col text-xl">
      <main>{children}</main>
      <Footer />
    </div>
  )
}

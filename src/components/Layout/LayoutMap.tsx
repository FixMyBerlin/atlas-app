import React from 'react'
import { HeaderRegionen } from './Header'

type Props = {
  children?: React.ReactNode
}

// About h-screen-layout with Header: https://stackoverflow.com/a/64260554/729221
export const LayoutMap: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <HeaderRegionen />
      <main className="flex-grow">{children}</main>
    </div>
  )
}

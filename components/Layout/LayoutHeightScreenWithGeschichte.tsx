import GeschichteForNextjs from 'geschichte/nextjs'
import React from 'react'
import { Header } from './Header'

type Props = {
  children?: React.ReactNode
}

// About h-screen-layout with Header: https://stackoverflow.com/a/64260554/729221
export const LayoutHeightScreenWithGeschichte: React.FC<Props> = ({
  children,
}) => {
  return (
    <GeschichteForNextjs>
      <div className=" flex h-screen flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
      </div>
    </GeschichteForNextjs>
  )
}

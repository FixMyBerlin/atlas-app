import React from 'react'
import { HeaderRegionen } from './Header'
import { LayoutPage } from './LayoutPage'

type Props = {
  children?: React.ReactNode
}

export const LayoutMapPage: React.FC<Props> = ({ children }) => {
  return <LayoutPage header={<HeaderRegionen />}>{children}</LayoutPage>
}

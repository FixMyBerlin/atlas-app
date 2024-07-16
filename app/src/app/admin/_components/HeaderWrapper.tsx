import React from 'react'

export const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <header className="my-10 flex justify-between">{children}</header>
}

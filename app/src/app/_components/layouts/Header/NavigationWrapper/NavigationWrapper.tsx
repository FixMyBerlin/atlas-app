import React from 'react'

type Props = { children: React.ReactNode }

export const NavigationWrapper: React.FC<Props> = ({ children }) => {
  return (
    <nav className="z-10 bg-gray-800 shadow-xl">
      <div className="mx-auto px-2 sm:px-6 lg:pl-5 lg:pr-2.5">{children}</div>
    </nav>
  )
}

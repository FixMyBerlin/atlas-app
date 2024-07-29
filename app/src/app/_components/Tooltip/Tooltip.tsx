import { twJoin } from 'tailwind-merge'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  text: string
  className?: string
  children: React.ReactNode
}

export const Tooltip: React.FC<Props> = ({ text, children, className }) => {
  const [positionTop, setPotitionTop] = useState(0)
  const parentWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (parentWrapperRef.current) {
      setPotitionTop(parentWrapperRef.current.clientHeight)
    }
  }, [])

  return (
    <div className={twJoin('group/tooltip', className)} ref={parentWrapperRef}>
      <div
        className="absolute hidden select-none rounded bg-gray-900/90 p-2 text-xs text-white shadow-md group-hover/tooltip:z-50 group-hover/tooltip:block"
        style={{ top: -positionTop, width: '20.5rem' }}
      >
        {text}
      </div>
      {children}
    </div>
  )
}

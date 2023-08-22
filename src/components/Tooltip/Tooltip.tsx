import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  text: string
  className?: string
  children: React.ReactNode
}

const Tooltip: React.FC<Props> = ({ text, children, className }) => {
  const [positionTop, setPotitionTop] = useState(0)
  const parentWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (parentWrapperRef.current) {
      setPotitionTop(parentWrapperRef.current.clientHeight)
    }
  }, [parentWrapperRef.current])

  return (
    <div className={clsx('group/tooltip', className)} ref={parentWrapperRef}>
      <div
        className={`absolute hidden select-none whitespace-nowrap rounded bg-gray-900/90 p-2 text-xs text-white shadow-md group-hover/tooltip:z-50 group-hover/tooltip:block`}
        style={{ top: positionTop + 3 }}
      >
        {text}
      </div>
      {children}
    </div>
  )
}

export default Tooltip

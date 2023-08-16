import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  text: string
  className?: string
  children: React.ReactNode
}

const Tooltip: React.FC<Props> = ({ text, children, className }) => {
  const [height, setHeight] = useState(0)
  const parentWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (parentWrapperRef.current) {
      setHeight(parentWrapperRef.current.clientHeight)
    }
  }, [parentWrapperRef.current])

  return (
    <div className={clsx('has-tooltip', className)} ref={parentWrapperRef}>
      <span
        className={`tooltip hyphens-nonte w-max cursor-default select-none break-keep rounded bg-gray-900 p-2 text-white shadow-md`}
        style={{ top: height + 3 }}
      >
        {text}
      </span>
      {children}
    </div>
  )
}

export default Tooltip

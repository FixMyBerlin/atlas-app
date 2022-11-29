import { XMarkIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import React from 'react'

type Props = {
  onClick: () => void
  positionClasses?: string
}

export const CloseButton: React.FC<Props> = ({
  onClick,
  positionClasses = 'top-2 right-2',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        positionClasses,
        'absolute  inline-flex items-center justify-center rounded-md border border-gray-300 p-1.5 text-gray-900 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
      )}
    >
      <span className="sr-only">Schließen</span>
      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
    </button>
  )
}

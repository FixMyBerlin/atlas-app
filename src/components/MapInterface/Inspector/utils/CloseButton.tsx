import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'

type Props = { onClick: () => void }

export const CloseButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    >
      <span className="sr-only">Hauptmenü öffnen</span>
      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
    </button>
  )
}

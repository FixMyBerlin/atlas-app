import clsx from 'clsx'
import React, { useState } from 'react'
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useMap } from 'react-map-gl'

interface Props {
  name?: string
}

export const ShowOsmNotes: React.FC<Props> = () => {
  const [active, setActive] = useState(false)
  const { mainMap } = useMap()

  return (
    <div className="ml-2 shadow-lg">
      <button
        onClick={() => setActive(!active)}
        className={clsx(
          active ? 'rounded-l-lg' : 'rounded-lg',
          active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
          'flex-0 group relative min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
          active ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-50 focus:z-10'
        )}
      >
        <div className="h-5 w-5">
          <ChatBubbleLeftRightIcon />
        </div>
        <span
          aria-hidden="true"
          className={clsx(
            active ? 'bg-yellow-500' : 'bg-transparent',
            'absolute inset-x-0 bottom-0 h-0.5'
          )}
        />
      </button>
      <button
        onClick={() => {
          console.warn('BBOX', mainMap.getBounds())
        }}
        className={clsx(
          'focus:z-9 rounded-r-lg bg-white transition-transform hover:bg-yellow-50',
          active ? 'translate-x-0' : '-translate-x-20',
          'text-gray-500 hover:text-gray-700',
          'flex-0 group min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
          active ? 'inline-flex' : 'hidden'
        )}
      >
        <div className="h-5 w-5">
          <PlusIcon />
        </div>
      </button>
    </div>
  )
}

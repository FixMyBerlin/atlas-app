import { ReactLocationDevtools } from '@tanstack/react-location-devtools'
import React from 'react'
import { useMapDebugState } from '../mapStateInteraction/useMapDebugState'

export const DebugStateReactLocation: React.FC = () => {
  const { showDebugInfo, setShowDebugInfo } = useMapDebugState()

  if (!showDebugInfo) return null

  return (
    <>
      <div className="group absolute bottom-3 right-12 z-10 max-h-screen max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
        <button
          className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 opacity-0 hover:bg-purple-800 hover:text-purple-200 group-hover:opacity-100"
          onClick={() => setShowDebugInfo(false)}
        >
          &times;
        </button>
        <ReactLocationDevtools
          initialIsOpen={false}
          position="bottom-right"
          toggleButtonProps={{ style: { position: 'relative', margin: 0 } }}
        />
      </div>
    </>
  )
}

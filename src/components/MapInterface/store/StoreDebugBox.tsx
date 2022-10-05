import React from 'react'

type Props = {
  zustandValues?: any
}

export const StoreDebugBox: React.FC<Props> = ({ zustandValues }) => {
  const keyValue = (object: any) => {
    return Object.entries(object).map(([key, value]) => {
      return (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(value)}
        </div>
      )
    })
  }

  return (
    <>
      <div className="absolute top-3 right-10 z-50 max-h-screen max-w-[60%] overflow-y-scroll rounded bg-pink-300 px-3 text-[10px]">
        <details>
          <summary>Zustand</summary>
          <div className="font-mono">{keyValue(zustandValues)}</div>
        </details>
      </div>
    </>
  )
}

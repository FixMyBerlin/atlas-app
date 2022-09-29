import React from 'react'

type Props = {
  geschichteValues?: any
  zustandValues?: any
}

export const StoreDebugBox: React.FC<Props> = ({
  geschichteValues,
  zustandValues,
}) => {
  const keyValue = (object: any) => {
    return Object.entries(object).map(([key, value]) => {
      return (
        <>
          <strong>{key}:</strong> {JSON.stringify(value)}
          <br />
        </>
      )
    })
  }

  return (
    <>
      <div className="absolute top-3 right-10 z-50 max-h-screen max-w-[60%] overflow-y-scroll rounded bg-pink-300 px-3 text-[10px]">
        <details>
          <summary>Geschichte</summary>
          <div className="font-mono">{keyValue(geschichteValues)}</div>
        </details>
        <details>
          <summary>Zustand</summary>
          <div className="font-mono">{keyValue(zustandValues)}</div>
        </details>
      </div>
    </>
  )
}

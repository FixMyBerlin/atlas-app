import React from 'react'

type Props = {
  geschichteValues?: any
  zustandValues?: any
}

export const StoreDebugBox: React.FC<Props> = ({
  geschichteValues,
  zustandValues,
}) => {
  const simplifiedZustandValues = {
    ...zustandValues,
    inspectorFeatures: 'removed',
  }
  return (
    <>
      <div className="z-50 absolute top-14 left-5 text-[10px] bg-pink-300 rounded px-3">
        <details>
          <summary>Geschichte</summary>
          <span className="font-mono">{JSON.stringify(geschichteValues)}</span>
        </details>
        <details>
          <summary>Zustand</summary>
          <span className="font-mono ">
            {JSON.stringify(simplifiedZustandValues)}
          </span>
          <details>
            <summary>
              <code>
                inspectorFeatures ({zustandValues?.inspectorFeatures?.length})
              </code>
            </summary>
            {JSON.stringify(zustandValues?.inspectorFeatures)}
          </details>
        </details>
      </div>
    </>
  )
}

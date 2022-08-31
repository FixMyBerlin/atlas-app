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
    interactiveLayerIds: 'removed',
    inspectorFeatures: 'removed',
  }
  return (
    <>
      <div className="absolute top-3 right-10 z-50 max-w-[90%] rounded bg-pink-300 px-3 text-[10px]">
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
          <details>
            <summary>
              <code>
                interactiveLayerIds (
                {zustandValues?.interactiveLayerIds?.length})
              </code>
            </summary>
            {JSON.stringify(zustandValues?.interactiveLayerIds)}
          </details>
        </details>
      </div>
    </>
  )
}

import React from 'react'
import { Layer } from 'react-map-gl'
import { layerVisibility, scopedId } from '../../../utils'
import { TarmacStyle } from '../utils'

type Props = {
  style: TarmacStyle
  source: string
  group: any // TODO TarmacStyleGroups; need to move the types around
  visible: boolean
}

export const LayerFromStyle: React.FC<Props> = ({
  style,
  source,
  group,
  visible,
}) => {
  const relevantLayers = style.layers.filter(
    (l) => l.metadata.groupName === group
  )
  const visibility = layerVisibility(visible)

  if (!relevantLayers.length) return null

  return (
    <>
      {relevantLayers.map((layer) => {
        const { id, type, layout, filter, paint, minzoom } = layer
        return (
          <Layer
            key={scopedId(group, id)}
            id={scopedId(group, id)}
            type={type as any}
            source={source}
            source-layer={layer['source-layer']}
            {...(!!minzoom && { minzoom })}
            // minzoom={minzoom || undefined} // TODO error
            layout={{
              ...visibility,
              ...layout,
            }}
            filter={filter || ['all']}
            // TODO wenn man es dynamisch macht, muss man das any/all auflösen, das aus den relevantLayers.layer.filter kommt. Evtl. kann man einfach mehrer 'all'-Calls wrappen? Das müssen wir ausprobieren…
            // filter={[
            //   'any',
            //   ['has', 'FMC:Category:SurfaceData:TODO:addMissingSmoothness'], // TODO dynamisch machen als Filter
            //   // ...(filter || ['in', 'name', '']),
            // ]}
            paint={paint || {}}
          />
        )
      })}
    </>
  )
}

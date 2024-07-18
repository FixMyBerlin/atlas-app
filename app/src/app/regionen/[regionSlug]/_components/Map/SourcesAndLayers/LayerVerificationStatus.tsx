import React from 'react'
import { Layer, LayerProps } from 'react-map-gl/maplibre'
import { useMapStoreLocalUpdates } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'

let errorLogged = false

export const LayerVerificationStatus = (parentLayerProps: LayerProps) => {
  const localUpdates = useMapStoreLocalUpdates()

  const props = {
    ...parentLayerProps,
    paint: structuredClone(parentLayerProps.paint),
  }

  let colorApproved: string, colorRejected: string, colorNull: string
  try {
    const [_0, _1, _a, _2, _r, _n] = props.paint!['line-color']
    colorApproved = _a || 'hsl(107, 88%, 57%)'
    colorRejected = _r || 'hsl(0, 100%, 41%)'
    colorNull = _n || '#fa7fe2'
  } catch (e) {
    if (!errorLogged) {
      console.error(e)
      // eslint-disable-next-line react-compiler/react-compiler
      errorLogged = true
    }
    return <Layer {...(props as LayerProps)} />
  }

  const currentValues = new Map()

  localUpdates.forEach(({ osm_id, verified }) => currentValues.set(osm_id, verified === 'approved'))

  const cond: any[] = (props.paint!['line-color'] = ['case'])
  currentValues.forEach((approved, osmId) => {
    cond.push(['==', ['get', 'osm_id'], osmId], approved ? colorApproved : colorRejected)
  })

  cond.push(
    ['==', ['get', 'verified'], 'approved'],
    colorApproved,
    ['==', ['get', 'verified'], 'rejected'],
    colorRejected,
    colorNull,
  )

  return <Layer {...(props as LayerProps)} />
}

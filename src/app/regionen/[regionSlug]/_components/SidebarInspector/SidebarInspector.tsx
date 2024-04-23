import React, { memo, Suspense, useRef } from 'react'
import { useMap, MapRef } from 'react-map-gl/maplibre'
import useResizeObserver from 'use-resize-observer'
import { clsx } from 'clsx'

import { Spinner } from 'src/app/_components/Spinner/Spinner'
import {
  Store,
  useMapStateInteraction,
} from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { Inspector } from './Inspector'
import { InspectorHeader } from './InspectorHeader'
import { createBoundingPolygon, allUrlFeaturesInBounds, fitBounds } from './util'
import { useSelectedFeatures } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useFeaturesParam/useSelectedFeatures'
import { useFeaturesParam } from '../../_hooks/useQueryState/useFeaturesParam/useFeaturesParam'

type Props = Pick<
  Store,
  | 'mapLoaded'
  | 'mapBounds'
  | 'resetInspectorFeatures'
  | 'setInspectorSize'
  | 'inspectorSize'
  | 'sidebarLayerControlsSize'
> & {
  map: MapRef
  uniqueInspectorFeatures: ReturnType<Store['getUniqueInspectorFeatures']>
  selectedFeatures: ReturnType<typeof useSelectedFeatures>
}

const SidebarInspectorMemoized: React.FC = memo(function SidebarInspectorMemoized(props: Props) {
  const checkBounds = useRef(true)

  const {
    map,
    mapLoaded,
    mapBounds, // needed to trigger rerendering
    uniqueInspectorFeatures,
    resetInspectorFeatures,
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  } = props

  const { ref } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
    onResize: ({ width, height }) => {
      if (width !== undefined && height !== undefined) {
        setInspectorSize({ width, height })
      }
    },
  })

  const { resetFeaturesParam } = useFeaturesParam()
  const selectedFeatures = useSelectedFeatures()
  const features = uniqueInspectorFeatures.length
    ? uniqueInspectorFeatures
    : selectedFeatures.map((f) => f.mapFeature).filter(Boolean)

  const boundingPolygon = createBoundingPolygon(map, sidebarLayerControlsSize, inspectorSize)

  if (features.length) {
    checkBounds.current = false
  }

  if (
    mapLoaded && // before map is not completely loaded we can't queryRenderedFeatures()
    checkBounds.current && // run this at most once
    inspectorSize.width !== 0 // size of the inspector needs to be known to check bounding box
  ) {
    const urlFeatures = selectedFeatures.map((f) => f.urlFeature)
    if (!allUrlFeaturesInBounds(urlFeatures, boundingPolygon)) {
      fitBounds(map, urlFeatures, sidebarLayerControlsSize, inspectorSize)
    }
    checkBounds.current = false
  }

  const renderFeatures = !!features.length

  const className = clsx(
    'absolute bottom-0 right-0 top-0 z-20 w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md',
    !renderFeatures && 'opacity-0 pointer-events-none',
  )

  return (
    <div ref={ref} className={className}>
      <Suspense fallback={<Spinner />}>
        {renderFeatures ? (
          <>
            <InspectorHeader
              count={features.length}
              handleClose={() => {
                resetFeaturesParam()
                resetInspectorFeatures()
              }}
            />
            <Inspector features={features} />
            <style
              dangerouslySetInnerHTML={{
                __html: '.maplibregl-ctrl-top-right { right: 35rem }',
              }}
            />
          </>
        ) : null}
      </Suspense>
    </div>
  )
})

export const SidebarInspector: React.FC = () => {
  const { mainMap: map } = useMap()
  const selectedFeatures = useSelectedFeatures()

  const {
    mapLoaded,
    mapBounds,
    getUniqueInspectorFeatures,
    resetInspectorFeatures,
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  } = useMapStateInteraction()

  const uniqueInspectorFeatures = getUniqueInspectorFeatures()

  if (!map) {
    return null
  }

  const props: Props = {
    map,
    mapLoaded,
    mapBounds,
    uniqueInspectorFeatures,
    resetInspectorFeatures,
    selectedFeatures,
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  }

  // @ts-ignore - let's keep it simple!
  return <SidebarInspectorMemoized {...props} />
}

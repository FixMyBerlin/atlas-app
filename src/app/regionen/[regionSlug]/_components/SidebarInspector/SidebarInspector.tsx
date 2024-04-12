import React, { memo, Suspense, useEffect, useRef } from 'react'
import { Feature } from '@turf/turf'
import { useMap } from 'react-map-gl/maplibre'
import useResizeObserver from 'use-resize-observer'

import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { Inspector } from './Inspector'
import { InspectorHeader } from './InspectorHeader'
import { createBoundingPolygon } from './util'
import { useSelectedFeatures } from 'src/app/_hooks/useSelectedFeatures'
import { useFeaturesParam } from '../../_hooks/useQueryState/useFeaturesParam'

const SidebarInspectorMemoized: React.FC = memo(function SidebarInspectorMemoized(props: any) {
  const {
    mapBounds, // needed to trigger rerendering
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  } = props

  const { ref } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
    onResize: setInspectorSize,
  })
  const { mainMap: map } = useMap()
  const { resetFeaturesParam } = useFeaturesParam()
  const selectedFeatures = useSelectedFeatures()
  const features = selectedFeatures.map((f) => f.mapFeature).filter(Boolean)

  if (!features.length) {
    setInspectorSize(null)
    return null
  }

  let boundingPolygon: Feature | null = null
  if (map && inspectorSize && sidebarLayerControlsSize) {
    boundingPolygon = createBoundingPolygon(map, sidebarLayerControlsSize, inspectorSize)
  }

  return (
    <div
      ref={ref}
      className="absolute bottom-0 right-0 top-0 z-20 w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md"
    >
      <Suspense fallback={<Spinner />}>
        <InspectorHeader count={features.length} handleClose={() => resetFeaturesParam()} />
        <Inspector features={features} boundingPolygon={boundingPolygon} />
      </Suspense>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .maplibregl-ctrl-top-right { right: 35rem }
          `,
        }}
      />
    </div>
  )
})

export const SidebarInspector: React.FC = () => {
  const { mapBounds, setInspectorSize, inspectorSize, sidebarLayerControlsSize } =
    useMapStateInteraction()

  const props = {
    mapBounds,
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  }

  // @ts-ignore - let's keep it simple!
  return <SidebarInspectorMemoized {...props} />
}

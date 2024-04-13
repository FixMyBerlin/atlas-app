import React, { memo, Suspense, useEffect } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import useResizeObserver from 'use-resize-observer'

import { Spinner } from 'src/app/_components/Spinner/Spinner'
import {
  Store,
  useMapStateInteraction,
} from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { Inspector } from './Inspector'
import { InspectorHeader } from './InspectorHeader'
import { allUrlFeaturesInBounds, createBoundingPolygon } from './util'
import { useSelectedFeatures } from 'src/app/_hooks/useSelectedFeatures'
import { useFeaturesParam } from '../../_hooks/useQueryState/useFeaturesParam'

type Props = Pick<
  Store,
  'mapBounds' | 'setInspectorSize' | 'inspectorSize' | 'sidebarLayerControlsSize'
>

const SidebarInspectorMemoized: React.FC = memo(function SidebarInspectorMemoized(props: Props) {
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

  const boundingPolygon = createBoundingPolygon(map, sidebarLayerControlsSize, inspectorSize)

  useEffect(() => {
    if (
      !allUrlFeaturesInBounds(
        selectedFeatures.map((f) => f.urlFeature),
        boundingPolygon,
      )
    ) {
      console.log('!!! zoom to make all features visible')
    } else {
      console.log('all features visible')
    }
    /* eslint-disable-next-line */
  }, [])

  if (!features.length) {
    setInspectorSize({ width: 0, height: 0 })
    return null
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
  const { mapLoaded, mapBounds, setInspectorSize, inspectorSize, sidebarLayerControlsSize } =
    useMapStateInteraction()

  if (!mapLoaded) {
    return null
  }

  const props: Props = {
    mapBounds,
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  }

  // @ts-ignore - let's keep it simple!
  return <SidebarInspectorMemoized {...props} />
}

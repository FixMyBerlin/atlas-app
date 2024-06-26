import { memo, Suspense, useRef } from 'react'
import { MapRef, useMap } from 'react-map-gl/maplibre'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import {
  useSelectedFeatures,
  type SelectedFeature,
} from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useFeaturesParam/useSelectedFeatures'
import useResizeObserver from 'use-resize-observer'
import {
  useMapStateInteraction,
  type Store,
} from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useFeaturesParam } from '../../_hooks/useQueryState/useFeaturesParam/useFeaturesParam'
import { Inspector } from './Inspector'
import { InspectorHeader } from './InspectorHeader'
import { allUrlFeaturesInBounds, createBoundingPolygon, fitBounds } from './util'
import { twJoin } from 'tailwind-merge'

type Props = Pick<
  Store,
  | 'mapLoaded'
  | 'mapBounds'
  | 'inspectorFeatures'
  | 'resetInspectorFeatures'
  | 'setInspectorSize'
  | 'inspectorSize'
  | 'sidebarLayerControlsSize'
> & {
  map: MapRef
  selectedFeatures: SelectedFeature[]
}

const SidebarInspectorMemoized = memo(function SidebarInspectorMemoized(props: Props) {
  const checkBounds = useRef(true)

  const {
    map,
    mapLoaded,
    mapBounds, // needed to trigger rerendering
    inspectorFeatures,
    selectedFeatures,
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

  if (inspectorFeatures.length) {
    checkBounds.current = false
  }

  if (
    mapLoaded && // before map is not completely loaded we can't queryRenderedFeatures()
    checkBounds.current && // run this at most once
    inspectorSize.width !== 0 // size of the inspector needs to be known to check bounding box
  ) {
    const boundingPolygon = createBoundingPolygon(map, sidebarLayerControlsSize, inspectorSize)
    const urlFeatures = selectedFeatures.map((f) => f.urlFeature)
    if (!allUrlFeaturesInBounds(urlFeatures, boundingPolygon)) {
      fitBounds(map, urlFeatures, sidebarLayerControlsSize, inspectorSize)
    }
    checkBounds.current = false
  }

  const features = inspectorFeatures.length
    ? inspectorFeatures
    : selectedFeatures.map((f) => f.mapFeature).filter(Boolean)

  const renderFeatures = !!features.length

  const className = twJoin(
    'absolute bottom-0 right-0 top-0 z-20 w-[35rem] max-w-full overflow-y-scroll bg-white p-5 pr-3 shadow-md',
    !renderFeatures && 'opacity-0 pointer-events-none',
  )

  const { resetFeaturesParam } = useFeaturesParam()
  const { resetInspectorFeatures } = props
  const handleClose = () => {
    resetFeaturesParam()
    resetInspectorFeatures()
  }

  return (
    <div ref={ref} className={className}>
      <Suspense fallback={<Spinner />}>
        {renderFeatures ? (
          <>
            <InspectorHeader count={features.length} handleClose={handleClose} />
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

export const SidebarInspector = () => {
  const { mainMap: map } = useMap()
  const selectedFeatures = useSelectedFeatures()

  const {
    mapLoaded,
    mapBounds,
    inspectorFeatures,
    resetInspectorFeatures,
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  } = useMapStateInteraction()

  if (!map) {
    return null
  }

  const props: Props = {
    map,
    mapLoaded,
    mapBounds,
    inspectorFeatures,
    resetInspectorFeatures,
    selectedFeatures,
    setInspectorSize,
    inspectorSize,
    sidebarLayerControlsSize,
  }

  // @ts-ignore - let's keep it simple!
  return <SidebarInspectorMemoized {...props} />
}

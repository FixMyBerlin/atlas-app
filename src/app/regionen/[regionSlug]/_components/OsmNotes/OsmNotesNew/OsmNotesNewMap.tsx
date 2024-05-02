import { MapPinIcon, PlusIcon } from '@heroicons/react/24/solid'
import * as turf from '@turf/turf'
import { MapProps } from 'react-map-gl'
import {
  AttributionControl,
  Map as MapGl,
  Marker,
  NavigationControl,
  type ViewStateChangeEvent,
} from 'react-map-gl/maplibre'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useNewOsmNoteMapParam } from '../../../_hooks/useQueryState/useOsmNotesParam'
import { SourceLayerBikelanes } from './OsmNotesNewMap/SourceLayerBikelanes'
import { SourceLayerFeature } from './OsmNotesNewMap/SourceLayerFeature'

export const OsmNotesNewMap = () => {
  const { newOsmNoteMapParam, setNewOsmNoteMapParam } = useNewOsmNoteMapParam()

  const handleMove = (event: ViewStateChangeEvent) => {
    setNewOsmNoteMapParam({
      zoom: event.viewState.zoom,
      lat: event.viewState.latitude,
      lng: event.viewState.longitude,
    })
  }

  let initialViewState: MapProps['initialViewState'] = {
    longitude: newOsmNoteMapParam?.lng,
    latitude: newOsmNoteMapParam?.lat,
    zoom: newOsmNoteMapParam?.zoom,
  }
  const { osmNewNoteFeature } = useMapStateInteraction()
  if (osmNewNoteFeature) {
    initialViewState = {
      bounds: turf.bbox(osmNewNoteFeature.geometry) as [number, number, number, number],
      fitBoundsOptions: { padding: 100, maxZoom: 17 },
    }
  }

  if (!newOsmNoteMapParam) return null

  return (
    <section className="relative min-h-80">
      <div className="absolute inset-x-1 top-4 z-10 flex justify-center">
        <h2 className="rounded-lg bg-teal-700 px-2 py-1 font-semibold leading-tight text-teal-50">
          1. Position bestimmen
        </h2>
      </div>

      <MapGl
        id="newNoteMap"
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={process.env.NEXT_PUBLIC_APP_ORIGIN + '/api/map/style'}
        interactiveLayerIds={[]}
        cursor={'grab'}
        onMoveEnd={handleMove}
        onMove={handleMove}
        doubleClickZoom={true}
        dragRotate={false}
        // @ts-expect-error: See https://github.com/visgl/react-map-gl/issues/2310
        RTLTextPlugin={null}
        minZoom={3}
        attributionControl={false}
      >
        <NavigationControl showCompass={false} position="bottom-left" />
        <AttributionControl compact={true} position="bottom-right" />

        <Marker
          latitude={newOsmNoteMapParam.lat}
          longitude={newOsmNoteMapParam.lng}
          anchor="bottom"
        >
          <MapPinIcon className="h-8 w-8 text-teal-700" />
          <PlusIcon className="-mb-4 h-8 w-8 text-teal-700" />
        </Marker>

        <SourceLayerFeature />
        <SourceLayerBikelanes />
      </MapGl>
    </section>
  )
}

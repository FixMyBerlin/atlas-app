import React from 'react'
import { extractDataIdIdFromDataKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey'
import { sourcesDatasets } from '../mapData/sourcesMapData'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'
import { createInspectorFeatureKey } from '../utils'
import { InspectorFeatureDataset } from './InspectorFeatureDataset'
import { InspectorFeatureSource } from './InspectorFeatureSource'
import { InspectorHeader } from './InspectorHeader'
import { InspectorFeatureOsmNote } from './InspectorFeatureOsmNote'

export type InspectorDataFeature = {
  sourceKey: string
  properties: GeoJSON.GeoJsonProperties
  geometry: maplibregl.GeoJSONFeature['geometry']
}

export type InspectorOsmNoteFeature = Omit<InspectorDataFeature, "sourceKey">

export const Inspector: React.FC = () => {
  const { inspectorFeatures, resetInspector } = useMapStateInteraction()

  // Differentiate between OSM Notes and processed OSM Data
  const osmNotesFeatures = inspectorFeatures.filter((f) => f.source === 'osm-notes')
  const osmDataFeatures = inspectorFeatures.filter((f) => f.source !== 'osm-notes')

  // When we click on the map, MapLibre returns all Features for all layers.
  // For hidden layers like the hitarea layer, those features are duplicates which we filter out.
  const uniqueKeys: Record<string, boolean> = {}
  const uniqueInspectorFeatures = osmDataFeatures.reduce(
    (result: typeof inspectorFeatures, feature) => {
      if (!uniqueKeys[createInspectorFeatureKey(feature)]) {
        uniqueKeys[createInspectorFeatureKey(feature)] = true
        result.push(feature)
      }
      return result
    },
    []
  )

  if (!uniqueInspectorFeatures.length && !osmNotesFeatures.length) return null

  return (
    <div className="absolute top-0 right-0 bottom-0 z-10 w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md">
      <InspectorHeader
        count={uniqueInspectorFeatures.length}
        handleClose={() => resetInspector()}
      />

      {osmNotesFeatures.map((inspectObject) => {
        const sourceKey = String(inspectObject.layer.source)
        if (!sourceKey) return null

        if (!inspectObject?.properties?.id) return null

        return (
          <InspectorFeatureOsmNote
            key={`osm-note-${inspectObject.properties.id}`}
            properties={inspectObject.properties}
            geometry={inspectObject.geometry}
          />
        )
      })}

      {uniqueInspectorFeatures.map((inspectObject) => {
        const sourceKey = String(inspectObject.layer.source)
        if (!sourceKey) return null

        const isDataset = sourcesDatasets.some(
          (d) => d.id === extractDataIdIdFromDataKey(sourceKey)
        )
        if (isDataset) {
          return (
            <InspectorFeatureDataset
              key={createInspectorFeatureKey(inspectObject)}
              sourceKey={sourceKey}
              properties={inspectObject.properties}
              geometry={inspectObject.geometry}
            />
          )
        }

        return (
          <InspectorFeatureSource
            key={sourceKey}
            sourceKey={sourceKey}
            properties={inspectObject.properties}
            geometry={inspectObject.geometry}
          />
        )
      })}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .maplibregl-ctrl-top-right { right: 35rem }
          `,
        }}
      />
    </div>
  )
}

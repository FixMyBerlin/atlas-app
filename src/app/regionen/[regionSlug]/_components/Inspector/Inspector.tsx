import React from 'react'
import { extractDataIdIdFromDataKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey/extractFromKey'
import { sourcesDatasets } from '../mapData/sourcesMapData/sourcesDatasets/sourcesDatasets.const'
import {
  StoreFeaturesInspector,
  useMapStateInteraction,
} from '../mapStateInteraction/useMapStateInteraction'
import { createInspectorFeatureKey } from '../utils/createKeyUtils/createKeyUtils'
import { InspectorFeatureDataset } from './InspectorFeatureDataset'
import { InspectorFeatureOsmNote } from './InspectorFeatureOsmNote'
import { InspectorFeatureSource } from './InspectorFeatureSource'
import { InspectorHeader } from './InspectorHeader'

export type InspectorDataFeature = {
  sourceKey: string
  properties: GeoJSON.GeoJsonProperties
  geometry: StoreFeaturesInspector['inspectorFeatures'][number]['geometry']
}

export type InspectorOsmNoteFeature = Omit<InspectorDataFeature, 'sourceKey'>

export const Inspector: React.FC = () => {
  const { inspectorFeatures, resetInspector } = useMapStateInteraction()

  // When we click on the map, MapLibre returns all Features for all layers.
  // For hidden layers like the hitarea layer, those features are duplicates which we filter out.
  const uniqueKeys: Record<string, boolean> = {}
  const uniqueInspectorFeatures = inspectorFeatures.reduce(
    (result: typeof inspectorFeatures, feature) => {
      if (!uniqueKeys[createInspectorFeatureKey(feature)]) {
        uniqueKeys[createInspectorFeatureKey(feature)] = true
        result.push(feature)
      }
      return result
    },
    [],
  )

  if (!uniqueInspectorFeatures.length) return null

  return (
    <div className="absolute bottom-0 right-0 top-0 z-10 w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md">
      <InspectorHeader
        count={uniqueInspectorFeatures.length}
        handleClose={() => resetInspector()}
      />

      {uniqueInspectorFeatures.map((inspectObject) => {
        const sourceKey = String(inspectObject.source) // Format: `theme:lit--source:tarmac_lit--topic:lit`
        if (!sourceKey) return null

        // Inspector-Block for Notes
        if (inspectObject.source === 'osm-notes') {
          return (
            <InspectorFeatureOsmNote
              key={`osm-note-${inspectObject?.properties?.id}`}
              properties={inspectObject.properties}
            />
          )
        }

        // Inspector-Block for Datasets
        const isDataset = sourcesDatasets.some(
          (d) => d.id === extractDataIdIdFromDataKey(sourceKey),
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

        // Inspector-Block for Features
        return (
          <InspectorFeatureSource
            key={createInspectorFeatureKey(inspectObject)}
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
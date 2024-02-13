import { extractDataIdIdFromDataKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey/extractFromKey'
import { useRegionDatasets } from '../SelectDatasets/utils/useRegionDatasets'
import { StoreFeaturesInspector } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { createInspectorFeatureKey } from '../utils/createKeyUtils/createKeyUtils'
import { InspectorFeatureDataset } from './InspectorFeatureDataset'
import { InspectorFeatureOsmNote } from './InspectorFeatureOsmNote'
import { InspectorFeatureSource } from './InspectorFeatureSource'

export type InspectorDataFeature = {
  sourceKey: string
  properties: GeoJSON.GeoJsonProperties
  geometry: StoreFeaturesInspector['unfilteredInspectorFeatures'][number]['geometry']
}

export type InspectorOsmNoteFeature = Omit<InspectorDataFeature, 'sourceKey'>

type Props = { features: StoreFeaturesInspector['unfilteredInspectorFeatures'] }

export const Inspector = ({ features }: Props) => {
  const regionDatasets = useRegionDatasets()

  return (
    <>
      {features.map((inspectObject) => {
        const sourceKey = String(inspectObject.source) // Format: `category:lit--source:atlas_lit--subcategory:lit`
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
        const isDataset = regionDatasets.some((d) => d.id === extractDataIdIdFromDataKey(sourceKey))
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
    </>
  )
}

import { StoreFeaturesInspector } from '../../_hooks/mapState/useMapState'
import { useRegionDatasets } from '../../_hooks/useRegionDatasets/useRegionDatasets'
import { parseSourceKeyStaticDatasets } from '../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { createInspectorFeatureKey } from '../utils/sourceKeyUtils/createInspectorFeatureKey'
import { InspectorFeatureStaticDataset } from './InspectorFeatureStaticDataset'
import { InspectorFeatureOsmNote } from './InspectorFeatureOsmNote'
import { InspectorFeatureAtlasGeo } from './InspectorFeatureAtlasGeo'
import { InspectorFeatureAtlasNote } from './InspectorFeatureAtlasNote'

export type InspectorFeatureProperty = NonNullable<GeoJSON.GeoJsonProperties>

export type InspectorFeature = {
  sourceKey: string
  feature: StoreFeaturesInspector['inspectorFeatures'][number]
}

export type InspectorOsmNoteFeature = Omit<InspectorFeature, 'sourceKey'>

type Props = { features: StoreFeaturesInspector['inspectorFeatures'] }

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
              feature={inspectObject}
            />
          )
        }
        if (inspectObject.source === 'atlas-notes') {
          return (
            <InspectorFeatureAtlasNote
              key={`atlas-note-${inspectObject?.properties?.id}`}
              noteId={inspectObject.properties.id}
            />
          )
        }

        // Inspector-Block for Datasets
        const isDataset = regionDatasets.some(
          (d) => d.id === parseSourceKeyStaticDatasets(sourceKey).sourceId,
        )
        if (isDataset) {
          return (
            <InspectorFeatureStaticDataset
              key={createInspectorFeatureKey(inspectObject)}
              sourceKey={sourceKey}
              feature={inspectObject}
            />
          )
        }

        // Inspector-Block for Features
        return (
          <InspectorFeatureAtlasGeo
            key={createInspectorFeatureKey(inspectObject)}
            sourceKey={sourceKey}
            feature={inspectObject}
          />
        )
      })}
    </>
  )
}

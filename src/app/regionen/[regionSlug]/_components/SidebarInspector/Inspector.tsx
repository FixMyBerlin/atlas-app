import React from 'react'
import { Feature } from '@turf/turf'

import { StoreFeaturesInspector } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useRegionDatasets } from '../../_hooks/useRegionDatasets/useRegionDatasets'
import { extractSourceIdFromStaticDatasetSourceKey } from '../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { createInspectorFeatureKey } from '../utils/sourceKeyUtils/createInspectorFeatureKey'
import { InspectorFeatureStaticDataset } from './InspectorFeatureStaticDataset'
import { InspectorFeatureOsmNote } from './InspectorFeatureOsmNote'
import { InspectorFeatureAtlasGeo } from './InspectorFeatureAtlasGeo'
import { compareFeatures, Visibility } from './util'

export type InspectorDataFeature = {
  sourceKey: string
  properties: GeoJSON.GeoJsonProperties
  geometry: StoreFeaturesInspector['unfilteredInspectorFeatures'][number]['geometry']
}

export type InspectorOsmNoteFeature = Omit<InspectorDataFeature, 'sourceKey'>

type Props = {
  features: StoreFeaturesInspector['unfilteredInspectorFeatures']
  boundingPolygon: Feature | null
}

export const Inspector = ({ features, boundingPolygon }: Props) => {
  const regionDatasets = useRegionDatasets()

  const visibles: Visibility[] = []

  const elements = features.map((feature) => {
    const sourceKey = String(feature.source) // Format: `category:lit--source:atlas_lit--subcategory:lit`
    if (!sourceKey) return null

    // Inspector-Block for Notes
    if (feature.source === 'osm-notes') {
      return (
        <InspectorFeatureOsmNote
          key={`osm-note-${feature?.properties?.id}`}
          properties={feature.properties}
        />
      )
    }

    // Inspector-Block for Datasets
    const isDataset = regionDatasets.some(
      (d) => d.id === extractSourceIdFromStaticDatasetSourceKey(sourceKey),
    )
    if (isDataset) {
      return (
        <InspectorFeatureStaticDataset
          key={createInspectorFeatureKey(feature)}
          sourceKey={sourceKey}
          properties={feature.properties}
          geometry={feature.geometry}
        />
      )
    }

    // Inspector-Block for Features
    const visible: Visibility = boundingPolygon ? compareFeatures(boundingPolygon, feature) : '>'
    visibles.push(visible)
    return (
      <InspectorFeatureAtlasGeo
        key={createInspectorFeatureKey(feature)}
        sourceKey={sourceKey}
        properties={feature.properties}
        geometry={feature.geometry}
        visible={visible}
      />
    )
  })

  return <>{elements}</>
}

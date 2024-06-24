import * as turf from '@turf/turf'
import type { FeatureCollection, Geometry, Point } from 'geojson'
import { create } from 'zustand'
import { OsmTypeIdNonNull } from '../../_components/SidebarInspector/Tools/osmUrls/extractOsmTypeIdByConfig'
import { OsmNotesThread } from '../../_components/notes/OsmNotes/types'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

export type Store = StoreOsmNotesFeatures & StoreOsmNewNoteFeature

type StoreOsmNotesFeatures = {
  osmNotesFeatures: FeatureCollection<Point, OsmNotesThread>
  actions: { setOsmNotesFeatures: (osmNotesFeatures: Store['osmNotesFeatures']) => void }
}

type StoreOsmNewNoteFeature = {
  osmNewNoteFeature: ({ geometry: Geometry } & OsmTypeIdNonNull) | undefined
  actions: { setOsmNewNoteFeature: (osmNewNoteFeature: Store['osmNewNoteFeature']) => void }
}

const useMapNotes = create<Store>((set) => {
  return {
    // Data for <Inspector> AND <SourcesLayersOsmNotes>
    osmNotesFeatures: turf.featureCollection([]),
    // Data for <OsmNotesNew>
    osmNewNoteFeature: undefined,

    actions: {
      setOsmNotesFeatures: (osmNotesFeatures) => set({ osmNotesFeatures }),
      setOsmNewNoteFeature: (osmNewNoteFeature) => set({ osmNewNoteFeature }),
    },
  }
})

export const useOsmNotesFeatures = () => useMapNotes((state) => state.osmNotesFeatures)
export const useOsmNewNoteFeature = () => useMapNotes((state) => state.osmNewNoteFeature)
export const useOsmNotesActions = () => useMapNotes((state) => state.actions)

import { MapDataSourceInspectorEditor } from 'src/app/regionen/[regionSlug]/_mapData/types'
import { RegionSlug } from 'src/app/regionen/(index)/_data/regions.const'
import { translations } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/TagsTable/translations/translations.const'

// a modified version of MapDataDatasetsSource from '../../src/app/regionen/[regionSlug]/_mapData/types'
type MapDataDatasetsSource = {
  /** @desc Associate the dataset with a region. This is the only place where we connect object to region, not region to object. But it makes more sence this way. */
  regionKey: RegionSlug[]
  /** @desc Whenever we have one dataset multipe time, we need a subid to make them unique */
  subId?: string
  name: string
  description?: string
  attributionHtml: string
  inspector:
    | ({
        enabled: true
        highlightingKey: 'TODO' // This is not implemented, yet
        /** @desc Array of key strings OR `false` to list all available keys */
        documentedKeys: string[] | false
        editors?: MapDataSourceInspectorEditor[]
      } & (
        | { disableTranslations?: false; translations: typeof translations }
        | { disableTranslations: true; translations?: never }
      ))
    | {
        enabled: false
      }
  layers: (
    | (mapboxgl.CircleLayer & Required<Pick<mapboxgl.CircleLayer, 'paint'>>)
    | (mapboxgl.FillLayer & Required<Pick<mapboxgl.FillLayer, 'paint'>>)
    | (mapboxgl.LineLayer & Required<Pick<mapboxgl.LineLayer, 'paint'>>)
    | (mapboxgl.SymbolLayer & Required<Pick<mapboxgl.SymbolLayer, 'paint' | 'layout'>>)
    | (mapboxgl.HeatmapLayer & Required<Pick<mapboxgl.SymbolLayer, 'paint'>>)
  )[]
} & {
  type: 'vector'
}

export type MetaData = {
  regions: string[]
  public: boolean
  config: MapDataDatasetsSource
}

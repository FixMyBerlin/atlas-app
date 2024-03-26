import { translations } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/TagsTable/translations/translations.const'
import {
  FileMapDataSubcategoryStyleLegend,
  MapDataSourceInspectorEditor,
} from 'src/app/regionen/[regionSlug]/_mapData/types'

// a modified version of MapDataDatasetsSource from '../../src/app/regionen/[regionSlug]/_mapData/types'
type MapDataDatasetsSource = {
  /** @desc Whenever we have one dataset multipe time, we need a subid to make them unique */
  subId?: string
  name: string
  /** @desc A quick-n-dirty way to get type savety for categories. The prefix is just to make type savety per region (or cluster of regions) possible. */
  category: 'bb/Bestandsdaten' | 'bb/Radnetze' | 'bb/Netzkonzeption' | 'bb/Landesdaten' | null
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
  legends?: null | FileMapDataSubcategoryStyleLegend[]
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
  configs: MapDataDatasetsSource[]
}

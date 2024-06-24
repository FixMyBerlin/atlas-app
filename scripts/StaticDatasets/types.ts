import { translations } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/TagsTable/translations/translations.const'
import { StaticDatasetCategoryKey } from 'src/app/regionen/[regionSlug]/_mapData/mapDataStaticDatasetCategories/staticDatasetCategories.const'
import {
  FileMapDataSubcategoryStyleLegend,
  MapDataOsmIdConfig,
  MapDataSourceInspectorEditor,
} from 'src/app/regionen/[regionSlug]/_mapData/types'

// a modified version of MapDataDatasetsSource from '../../src/app/regionen/[regionSlug]/_mapData/types'
type MapDataDatasetsSource = {
  /** @desc Whenever we have one dataset multiple time, we need a subid to make them unique */
  subId?: string
  name: string
  /** @desc A quick-n-dirty way to get type safety for categories. The prefix is just to make type safety per region (or cluster of regions) possible. */
  category: StaticDatasetCategoryKey | null
  updatedAt?: string
  description?: string
  /** @desc A link to the source or a description of how the data was created */
  dataSourceMarkdown?: string
  /** @desc Entity that has to be named as creator (c) of the data on the map an at the dataset */
  attributionHtml: string
  /** @desc Licence Shortcode */
  licence?: undefined | 'ODbL' | 'CC-Zero' | 'CC-BY-2.0' | 'CC-BY-4.0' | 'DL-DE/BY-2.0'
  /** @desc Are the data OSM compatible due to the licence itself or an explicit waiver */
  licenceOsmCompatible?: undefined | 'licence' | 'waiver' | 'no'
  osmIdConfig?: MapDataOsmIdConfig
  inspector:
    | ({
        enabled: true
        highlightingKey: string
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
    | (mapboxgl.HeatmapLayer & Required<Pick<mapboxgl.HeatmapLayer, 'paint'>>)
  )[]
}

export type MetaData = {
  regions: string[]
  public: boolean
  configs: MapDataDatasetsSource[]
}

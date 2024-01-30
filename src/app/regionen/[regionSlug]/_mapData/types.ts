import {
  AnyLayer,
  CircleLayer,
  FillLayer,
  HeatmapLayer,
  LineLayer,
  RasterSource,
  SymbolLayer,
} from 'react-map-gl'
import { Prettify } from 'src/app/_components/types/types'
import { RegionSlug } from 'src/app/regionen/(index)/_data/regions.const'
import { LegendIconTypes } from '../_components/SidebarLayerControls/Legend/LegendIcons/types'
import { MapDataCategoryId } from './mapDataCategories/categories.const'
import { SourcesId } from './mapDataSources/sources.const'
import { StyleId, SubcategoryId } from './typeId'

/** @desc: The background tiles, configured in 'sourcesBackgroundsRaster.const.ts' */
export type MapDataBackgroundSource<TIds> = {
  id: TIds
  name: string
  /** @desc URL of the tiles */
  tiles: string
  attributionHtml: string
  /** @desc Show link to the external legend of that map layer. Will replace {z}/{x}/{y} if present  */
  legendUrl?: string
  minzoom?: RasterSource['minzoom']
  maxzoom?: RasterSource['maxzoom']
  tileSize?: RasterSource['tileSize']
}

/** @desc: The data sources, configured in 'sourcesDatasets.const.ts' */
export type MapDataDatasetsSource<TIds> = {
  /** @desc Associate the dataset with a region. This is the only place where we connect object to region, not region to object. But it makes more sence this way. */
  regionKey: RegionSlug[]
  id: TIds | string // TODO the "string" part should go away, if we keep this. Or it should all be "string". This was added during the migration of LegacyStaticDatasets
  /** @desc Whenever we have one dataset multipe time, we need a subid to make them unique */
  subId?: string
  name: string
  description?: string
  attributionHtml: string
  inspector:
    | {
        enabled: true
        highlightingKey: 'TODO' // This is not implemented, yet
        /** @desc Array of key strings OR `false` to list all available keys */
        documentedKeys: string[] | false
        disableTranslations?: boolean
        editors?: MapDataSourceInspectorEditor[]
      }
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
  /** @desc Required format is `pmtiles://${DatasetFiles}` */
  url: string
}

export type MapDataSourceInspectorEditor = {
  name: string
  idKey?: string
  urlTemplate: `https://${string}`
}

type MapDataSourceInspector =
  | {
      enabled: true
      /** @desc The key used by the highlighting LayerHighlight component to change the appearance of the selected element */
      highlightingKey: string
      /** @desc A sorted list of keys that we officially document.
       * Keys of type `composit_*` require their own TableRowCell-Component.
       * Keys of type `*__if_present` are only presented if a value is present.
       * (Keys that are not mentioned here are for debugging only.) */
      documentedKeys?: (string | `composit_${string}` | `${string}__if_present`)[]
      editors?: MapDataSourceInspectorEditor[]
    }
  | {
      enabled: false
    }

type MapDataSourceVerifcation<TVerIds> =
  | {
      enabled: true
      /** @desc Identifier for the verification API URL; verification is configured on the subcategory (`allowVerify`) */
      apiIdentifier: TVerIds
    }
  | {
      enabled: false
      apiIdentifier?: undefined
    }

// TODO: We change the data format in atlas-geo but did not update atlas-app, yet
export type MapDataSourceFreshnessConfig = {
  primaryKeyTranslation: string
  freshKey: string
  dateKey: string
}

type MapDataSourceFreshness =
  | {
      enabled: true
      /** @desc The `check_date:*=<Date>` key that that is used to calculate `is_fresh=<boolean>` */
      freshConfigs?: MapDataSourceFreshnessConfig[]
    }
  | {
      enabled: false
      freshConfigs?: undefined
    }

export type MapDataSourceCalculator =
  | {
      enabled: true
      keys: string[]
      queryLayers: string[]
      /** @desc The key used by the highlighting LayerHighlight component to change the appearance of the selected element */
      highlightingKey: string
    }
  | {
      enabled: false
      keys?: undefined
      queryLayers?: undefined
      highlightingKey?: undefined
    }

type MapDataSourceExport<TExpIds> =
  | {
      enabled: true
      /** @desc Identifier for the export API URL; export is only allowed when present */
      apiIdentifier: TExpIds
      title: string
      desc: string
    }
  | {
      enabled: false
      apiIdentifier?: undefined
      title?: undefined
      desc?: undefined
    }

/** @desc: Our own vector tile layers configured in 'sources.const.ts' */
export type MapDataSource<TIds, TVerIds, TExpIds> = {
  id: TIds
  /** @desc URL of the vector tiles */
  tiles: string
  attributionHtml: string // TODO anzeigen in der Karte
  licence: 'ODbL' | undefined
  /** @desc Inspector: Enable and configure Inspector */
  inspector: MapDataSourceInspector
  /** @desc Inspector: Enable info data on presence */
  // presence: {
  //   enabled: boolean
  // }
  /** @desc Inspector: Enable and configure in app verification */
  verification: MapDataSourceVerifcation<TVerIds>
  /** @desc Inspector: Enable and configure info data on freshness */
  freshness: MapDataSourceFreshness
  /** @desc Calculator: Enable and configure calculator feature */
  calculator: MapDataSourceCalculator
  /** @desc Export: Enable and configure data export */
  export: MapDataSourceExport<TExpIds>
  minzoom?: mapboxgl.RasterSource['minzoom']
  maxzoom?: mapboxgl.RasterSource['maxzoom']
}

export type StaticMapDataCategory = {
  id: MapDataCategoryId
  name: string
  desc?: string
  subcategories: StaticMapDataSubcategory[]
}

type StaticMapDataSubcategory = Prettify<
  FileMapDataSubcategory & {
    id: SubcategoryId
    defaultStyle: 'default' | 'hidden'
    // TODO: We might need to add a "mapOrder" value here to specify that "places" needs to be at the top on the map but at the bottom of the dropdown in the UI
  }
>

export type TBeforeIds = 'housenumber' | 'boundary_country' | 'landuse' | undefined

/** @desc: Thematic "filter" on the raw vector tile data; eg. 'Radinfrastruktur, Oberflächen, Beleuchtung' */
export type FileMapDataSubcategory = {
  id: SubcategoryId
  name: string
  sourceId: SourcesId
  beforeId?: TBeforeIds
} & (
  | {
      ui: 'dropdown'
      styles: (FileMapDataSubcategoryStyle | FileMapDataSubcategoryHiddenStyle)[]
    }
  | {
      ui: 'checkbox'
      styles: FileMapDataSubcategoryStyle[]
    }
)

/** @desc: Different visual views of the same thematic data; Can contain static filter, eg. "only lines with todos"); eg. 'Default,  Bad infrastructure (only)', 'Where debugging is needed' */
export type FileMapDataSubcategoryStyle = {
  id: StyleId
  name: string
  desc: null | string // TODO REMOVE
  layers: FileMapDataSubcategoryStyleLayer[]
  legends?: null | FileMapDataSubcategoryStyleLegend[]
}

export type FileMapDataSubcategoryHiddenStyle = {
  id: 'hidden'
  name: string
  desc: null // TODO REMOVE
  layers?: never
  legends?: never
}

/** @desc: The technical glue between sources and styles. The name "layers" is defined by the library we use. */
export type FileMapDataSubcategoryStyleLayer = Prettify<
  (CircleLayer | FillLayer | HeatmapLayer | LineLayer | SymbolLayer) &
    Required<Pick<AnyLayer, 'source-layer'>> & {
      /**
       * @default `true`
       * @desc optional `false` will hide the layer from `interactiveLayerIds` */
      interactive?: false
    }
>

/** @desc: Optional legend to explain a given layer */
export type FileMapDataSubcategoryStyleLegend = {
  id: string
  name: string
  desc?: string[]
  style:
    | {
        type: Exclude<LegendIconTypes, 'line'>
        color: string
        width?: never
        dasharray?: never
      }
    | {
        type: Extract<LegendIconTypes, 'line'>
        color: string
        width?: number
        dasharray?: number[]
      }
}

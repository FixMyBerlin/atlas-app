import { RegionSlug } from 'src/regions/data/regions.const'
import { SubcategoryIds, SubcategoryStyleIds } from './mapData.const'
import {
  AnyLayer,
  CircleLayer,
  FillLayer,
  HeatmapLayer,
  LineLayer,
  RasterSource,
  SymbolLayer,
} from 'react-map-gl'
import { MapDataCategoryIds } from './mapDataCategories/categories.const'
import {
  SourceExportApiIdentifier,
  SourceVerificationApiIdentifier,
  SourcesIds,
} from './mapDataSources/sources.const'
import { LegendIconTypes } from '../SidebarLayerControls/SelectLegend/LegendIcons/types'

/** @desc: The background tiles, configured in 'sourcesBackgroundsRaster.const.ts' */
export type MapDataBackgroundSource<TIds> = {
  id: TIds
  name: string
  /** @desc URL of the vector tiles */
  tiles: string
  attributionHtml: string // TODO anzeigen in der Karte
  /** @desc Show link to the external legend of that map layer. Will replace {z}/{x}/{y} if present  */
  legendUrl?: string
  type?: RasterSource['type']
  minzoom?: RasterSource['minzoom']
  maxzoom?: RasterSource['maxzoom']
  tileSize?: RasterSource['tileSize']
}

/** @desc: The data sources, configured in 'sourcesDatasets.const.ts' */
export type MapDataDatasetsSource<TIds> = {
  /** @desc Associate the dataset with a region. This is the only place where we connect object to region, not region to object. But it makes more sence this way. */
  regionKey: RegionSlug[]
  id: TIds
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

/** @desc: Top level thematik filter; usually one Category has one primary Subcat; eg. 'Radinfrastruktur, Quellen & Ziele, Straßentypen' */
export type MapDataCategory = {
  id: MapDataCategoryIds
  name: string
  desc?: string
  subcategories: MapDataSubcategory[]
}

type MapDataSubcategory = {
  id: SubcategoryIds
  defaultStyle: 'default' | 'hidden'
  ui: 'dropdown' | 'checkbox'
  // TODO: We might need to add a "mapOrder" value here to specify that "places" needs to be at the top on the map but at the bottom of the dropdown in the UI
}

export type TBeforeIds = 'housenumber' | 'boundary_country' | 'landuse' | undefined

/** @desc: Thematic "filter" on the raw vector tile data; eg. 'Radinfrastruktur, Oberflächen, Beleuchtung' */
export type MapDataSubcat = {
  id: SubcategoryIds
  name: string
  sourceId: SourcesIds
  beforeId?: TBeforeIds
  styles: MapDataStyle[]
}

/** @desc: Different visual views of the same thematic data; Can contain static filter, eg. "only lines with todos"); eg. 'Default,  Bad infrastructure (only)', 'Where debugging is needed' */
export type MapDataStyle =
  | {
      id: SubcategoryStyleIds
      name: string
      desc: null | string
      layers: MapDataVisLayer[]
      legends?: null | MapDataStyleLegend[]
    }
  | {
      id: 'hidden'
      name: string
      desc: null | string
      layers?: never
      legends?: never
    }

/** @desc: The technical glue between sources and styles. name fixed by library */
export type MapDataVisLayer = (CircleLayer | FillLayer | HeatmapLayer | LineLayer | SymbolLayer) &
  Required<Pick<AnyLayer, 'source-layer'>> & {
    /**
     * @default `true`
     * @desc optional `false` will hide the layer from `interactiveLayerIds` */
    interactive?: false
  }

/** @desc: Optional legend to explain a given layer */
export type MapDataStyleLegend = {
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

export type MapData = {
  sources: MapDataSource<SourcesIds, SourceVerificationApiIdentifier, SourceExportApiIdentifier>[]
  categories: MapDataCategory[]
  subcategories: MapDataSubcat[]
}

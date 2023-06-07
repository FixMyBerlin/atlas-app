import { RegionPath } from '@fakeServer/regions.const'
import mapboxgl from 'mapbox-gl'
import { LegendIconTypes } from '../SelectLegend/LegendIcons'
import { TopicIds, TopicStyleFilterIds, TopicStyleIds } from './mapData.const'
import {
  SourceExportApiIdentifier,
  SourcesIds,
  SourceVerificationApiIdentifier,
} from './sourcesMapData'
import { MapDataThemeIds } from './themesMapData'

/** @desc: The background tiles, configured in 'sourcesBackgroundsRaster.const.ts' */
export type MapDataBackgroundSource<TIds> = {
  id: TIds
  name: string
  /** @desc URL of the vector tiles */
  tiles: string
  attributionHtml: string // TODO anzeigen in der Karte
  /** @desc Show link to the external legend of that map layer. Will replace {z}/{x}/{y} if present  */
  legendUrl?: string
  type?: mapboxgl.Source['type']
  minzoom?: mapboxgl.RasterSource['minzoom']
  maxzoom?: mapboxgl.RasterSource['maxzoom']
  tileSize?: mapboxgl.RasterSource['tileSize']
}

/** @desc: The data sources, configured in 'sourcesDatasets.const.ts' */
export type MapDataDatasetsSource<TIds> = {
  /** @desc Associate the dataset with a region. This is the only place where we connect object to region, not region to object. But it makes more sence this way. */
  regionKey: RegionPath[]
  id: TIds
  name: string
  description?: string
  attributionHtml: string
  inspector:
    | {
        enabled: true
        highlightingKey: 'TODO' // This is not implemented, yet
        documentedKeys: string[]
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
      /** @desc Identifier for the verification API URL; verification is configured on the topic (`allowVerify`) */
      apiIdentifier: TVerIds
    }
  | {
      enabled: false
      apiIdentifier?: undefined
    }

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
    }
  | {
      enabled: false
      apiIdentifier?: undefined
    }

/** @desc: Our own vector tile layers configured in 'sources.const.ts' */
export type MapDataSource<TIds, TVerIds, TExpIds> = {
  id: TIds
  /** @desc URL of the vector tiles */
  tiles: string
  attributionHtml: string // TODO anzeigen in der Karte
  licence?: 'ODbL'
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

/** @desc: Top level thematik filter; usually one Theme has one primary Topic; eg. 'Radinfrastruktur, Quellen & Ziele, Straßentypen' */
export type MapDataTheme = {
  id: MapDataThemeIds
  name: string
  desc?: string
  topics: MapDataThemeTopic[]
}

type MapDataThemeTopic = {
  id: TopicIds
  defaultActive: boolean
  // TODO: We might need to add a "mapOrder" value here to specify that "places" needs to be at the top on the map but at the bottom of the dropdown in the UI
}

export type TBeforeIds = 'housenumber' | 'boundary_country' | 'landuse' | undefined

/** @desc: Thematic "filter" on the raw vector tile data; eg. 'Radinfrastruktur, Oberflächen, Beleuchtung' */
export type MapDataTopic = {
  id: TopicIds
  name: string
  desc: string | null
  sourceId: SourcesIds
  beforeId?: TBeforeIds
  styles: MapDataStyle[]
}

/** @desc: Different visual views of the same thematic data; Can contain static filter, eg. "only lines with todos"); eg. 'Default,  Bad infrastructure (only)', 'Where debugging is needed' */
export type MapDataStyle = {
  id: TopicStyleIds
  name: string
  desc: null | string
  layers: MapDataVisLayer[]
  interactiveFilters: null | MapDataStyleInteractiveFilter[]
  legends?: null | MapDataStyleLegend[]
}

/** @desc: The technical glue between sources and styles. name fixed by library */
export type MapDataVisLayer = (
  | mapboxgl.CircleLayer
  | mapboxgl.FillLayer
  | mapboxgl.HeatmapLayer
  | mapboxgl.LineLayer
  | mapboxgl.SymbolLayer
) &
  Required<Pick<mapboxgl.Layer, 'source-layer'>> & {
    /**
     * @default `true`
     * @desc optional `false` will hide the layer from `interactiveLayerIds` */
    interactive?: false
  }

/** @desc: Optional interactive filter of the styled data; eg. 'by year' */
export type MapDataStyleInteractiveFilter = {
  id: TopicStyleFilterIds
  name: string
  desc?: string
  inputType: 'checkbox' | 'radiobutton'
  filterConfig: { lookupKey: string }
  options: MapDataStyleInteractiveFilterOption[]
}

/** @desc: Optional legend that allows filtering the given layer */
export type MapDataStyleLegend = {
  id: string
  name: string
  desc?: string[]
  style:
    | {
        type: Exclude<LegendIconTypes, 'line'>
        color: string
        dasharray?: never
      }
    | {
        type: Extract<LegendIconTypes, 'line'>
        color: string
        dasharray?: number[]
      }
}

/** @desc: Options for the optional interactive filter of the styled data; eg. 'by year' */
export type MapDataStyleInteractiveFilterOption = {
  id: string
  name: string
  defaultActive?: boolean
}

export type MapData = {
  sources: MapDataSource<SourcesIds, SourceVerificationApiIdentifier, SourceExportApiIdentifier>[]
  themes: MapDataTheme[]
  topics: MapDataTopic[]
}

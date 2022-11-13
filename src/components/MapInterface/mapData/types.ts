import mapboxgl from 'mapbox-gl'
import { TopicIds, TopicStyleFilterIds, TopicStyleIds } from './mapData.const'
import {
  SourcesIds,
  SourcesRasterIds,
  SourceVerificationApiIdentifier,
} from './sourcesMapData'
import { MapDataThemeIds } from './themesMapData'

/** @desc: The background tiles, configured in 'sourcesBackgroundsRaster.const.ts' */
export type MapDataBackgroundSource<TIds> = {
  id: TIds
  /** @desc URL of the vector tiles */
  tiles: string
  attributionHtml: string // TODO anzeigen in der Karte
  /** @desc Show link to the external legend of that map layer. Will replace {z}/{x}/{y} if present  */
  legendUrl?: string
} & MapDataRasterSources

/** @desc: Our own vector tile layers configured in 'sources.const.ts' */
export type MapDataSource<TIds, TApiKeyIds> = {
  id: TIds
  /** @desc The part of the API URL that identifes the data set */
  apiVerificationIdentifier?: TApiKeyIds
  /** @desc URL of the vector tiles */
  tiles: string
  attributionHtml: string // TODO anzeigen in der Karte
  licence?: 'ODbL'
  /** @desc A list of keys that we officially document; other keys are for debugging; others are system keys */
  documentedKeys?: string[]
  /** @desc The key used by the highlighting LayerHighliht component to change the appearance of the selected element */
  highlightingKey: string
} & MapDataRasterSources

type MapDataRasterSources = {
  name?: string
  type?: mapboxgl.Source['type']
  minzoom?: mapboxgl.RasterSource['minzoom']
  maxzoom?: mapboxgl.RasterSource['maxzoom']
  tileSize?: mapboxgl.RasterSource['tileSize']
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

/** @desc: Thematic "filter" on the raw vector tile data; eg. 'Radinfrastruktur, Oberflächen, Beleuchtung' */
export type MapDataTopic = {
  id: TopicIds
  name: string
  desc: string | null
  sourceId: SourcesIds
  allowVerify: boolean
  styles: MapDataStyle[]
}

/** @desc: Different visual views of the same thematic data; Can contain static filter, eg. "only lines with todos"); eg. 'Default,  Bad infrastructure (only)', 'Where debugging is needed' */
export type MapDataStyle = {
  id: TopicStyleIds
  name: string
  desc: null | string
  layers: MapDataVisLayer[]
  interactiveFilters: null | MapDataStyleInteractiveFilter[]
}

/** @desc: The technical glue between sources and styles. name fixed by library */
export type MapDataVisLayer = (
  | mapboxgl.CircleLayer
  | mapboxgl.FillLayer
  | mapboxgl.HeatmapLayer
  | mapboxgl.LineLayer
  | mapboxgl.SymbolLayer
) & {
  enableCalculator?: boolean
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

/** @desc: Options for the optional interactive filter of the styled data; eg. 'by year' */
export type MapDataStyleInteractiveFilterOption = {
  id: string
  name: string
  defaultActive?: boolean
}

export type MapData = {
  sources: MapDataSource<SourcesIds, SourceVerificationApiIdentifier>[]
  backgrounds: MapDataBackgroundSource<SourcesRasterIds>[]
  themes: MapDataTheme[]
  topics: MapDataTopic[]
}

import mapboxgl from 'mapbox-gl'
import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleFilterIds,
  MapDataConfigTopicStyleIds,
} from './mapDataConfig.const'
import {
  MapDataConfigSourcesIds,
  MapDataConfigSourcesRasterIds,
} from './sourcesMapDataConfig'
import { MapDataConfigThemeIds } from './themesMapDataConfig'

/** @desc: The raw vector tile data; no UI representation; name fixed by library */
export type MapDataConfigSource<TIds> = {
  id: TIds
  /** @desc URL of the vector tiles */
  tiles: string
  attributionHtml: string // TODO anzeigen in der Karte
  /** @desc Show link to the external legend of that map layer. Will replace {z}/{x}/{y} if present  */
  legendUrl?: string
} & MapDataConfigRasterSources

type MapDataConfigRasterSources = {
  name?: string
  type?: mapboxgl.Source['type']
  minzoom?: mapboxgl.RasterSource['minzoom']
  maxzoom?: mapboxgl.RasterSource['maxzoom']
  tileSize?: mapboxgl.RasterSource['tileSize']
}

/** @desc: Top level thematik filter; usually one Theme has one primary Topic; eg. 'Radinfrastruktur, Quellen & Ziele, Straßentypen' */
export type MapDataConfigTheme = {
  id: MapDataConfigThemeIds
  name: string
  desc?: string
}

/** @desc: Thematic "filter" on the raw vector tile data; eg. 'Radinfrastruktur, Oberflächen, Beleuchtung' */
export type MapDataConfigTopic = {
  id: MapDataConfigTopicIds
  name: string
  desc: string
  sourceId: MapDataConfigSourcesIds
  defaultVisible: boolean
  styles: MapDataConfigStyles[]
}

/** @desc: Different visual views of the same thematic data; Can contain static filter, eg. "only lines with todos"); eg. 'Default,  Bad infrastructure (only)', 'Where debugging is needed' */
export type MapDataConfigStyles = {
  id: MapDataConfigTopicStyleIds
  name: string
  desc: null | string
  layers: MapDataConfigVisLayer[]
  interactiveFilters: null | MapDataConfigStyleInteractiveFilter[]
}

/** @desc: The technical glue between sources and styles. name fixed by library */
export type MapDataConfigVisLayer = (
  | mapboxgl.CircleLayer
  | mapboxgl.FillLayer
  | mapboxgl.HeatmapLayer
  | mapboxgl.LineLayer
  | mapboxgl.SymbolLayer
) & {
  enableInspector?: boolean
  enableCalculator?: boolean
}

/** @desc: Optional interactive filter of the styled data; eg. 'by year' */
export type MapDataConfigStyleInteractiveFilter = {
  id: MapDataConfigTopicStyleFilterIds
  name: string
  desc?: string
  filterConfig: { lookupKey: string }
  options: MapDataConfigStyleInteractiveFilterOption[]
}

/** @desc: Options for the optional interactive filter of the styled data; eg. 'by year' */
export type MapDataConfigStyleInteractiveFilterOption = {
  id: string
  name: string
  defaultActive?: boolean
}

export type MapDataConfig = {
  sources: MapDataConfigSource<MapDataConfigSourcesIds>[]
  backgrounds: MapDataConfigSource<MapDataConfigSourcesRasterIds>[]
  themes: MapDataConfigTheme[]
  topics: MapDataConfigTopic[]
}

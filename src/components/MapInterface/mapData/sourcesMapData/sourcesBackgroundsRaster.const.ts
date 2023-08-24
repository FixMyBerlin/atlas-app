import { MapDataBackgroundSource } from '../types'

export type SourcesRasterIds =
  | 'default'
  | 'strassenbefahrung'
  | 'alkis'
  | 'mapnik'
  | 'esri'
  | 'maptiler-satellite'
  | 'mapbox-satellite'
  | 'areal2023'
  | 'areal2022'
  | 'areal2021'
  | 'areal2020'
  | 'areal2019'
  | 'parkraumkarte_neukoelln'
  | 'cyclosm'
  | 'memomaps-transport'
  | 'thunderforest-opencyclemap'
  | 'thunderforest-transport'
  | 'thunderforest-landscape'
  | 'thunderforest-outdoors'
  | 'waymarkedtrails-cycling'
  | 'waymarkedtrails-hiking'
  | 'opentopomap'
  | 'trto-radwege'

// https://account.mapbox.com/access-tokens
// https://account.mapbox.com/access-tokens/clileup4r0b1r3gmp4hxqhou8/
// Has Domain restrictions
const tokenMapboxTilesets =
  'sk.eyJ1IjoiaGVqY28iLCJhIjoiY2xpbGV1cDRyMGIxcjNnbXA0aHhxaG91OCJ9.7ndjc3cZRsoYdoOvCrQ2AA'

// API Key https://cloud.maptiler.com/account/keys/db5f268c-c1ea-4cc4-8414-69ba179d11c0/settings
// Has Domain restrictions
const tokenMaptilerTilesets = 'wo0y3tqo53envRHnz2Bl'

export const sourcesBackgroundsRaster: MapDataBackgroundSource<SourcesRasterIds>[] = [
  {
    id: 'strassenbefahrung',
    name: 'Berlin: Straßenbefahrung 2014',
    type: 'raster',
    tiles: 'https://mapproxy.codefor.de/tiles/1.0.0/strassenbefahrung/mercator/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml:
      '<a target="_blank" href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_StraDa@senstadt&type=WMS">Geoportal Berlin / Straßenbefahrung 2014</a>',
  },
  {
    id: 'alkis',
    name: 'Berlin: Alkis',
    type: 'raster',
    tiles: 'https://mapproxy.codefor.de/tiles/1.0.0/alkis_30/mercator/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml:
      '<a target="_blank" href="https://fbinter.stadt-berlin.de/fb/berlin/service_intern.jsp?id=k_StraDa@senstadt&type=WMS">Geoportal Berlin / Straßenbefahrung 2014</a>',
  },
  {
    id: 'mapnik',
    name: 'OpenStreetMap Carto',
    type: 'raster',
    tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
  },
  {
    id: 'esri',
    name: 'Luftbild Esri',
    type: 'raster',
    tiles:
      'https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml: '<a href="https://wiki.openstreetmap.org/wiki/Esri">Esri Terms & Feedback</a>',
  },
  // Satellite from 2021 with aerial imagery for selected countries.
  // About https://documentation.maptiler.com/hc/en-us/articles/4405596670865-Satellite-maps#Satellitemaps-MapTilersatellitemaps
  //    But this article links to the deprecated source.
  // Depredated Data https://cloud.maptiler.com/tiles/satellite/
  // Data https://cloud.maptiler.com/tiles/satellite-v2/
  // Data JSON https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=ECOoUBmpqklzSCASXxcu
  {
    id: 'maptiler-satellite',
    name: 'Luftbild Maptiler',
    type: 'raster',
    tiles: `https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=${tokenMaptilerTilesets}`,
    tileSize: 512,
    minzoom: 0,
    maxzoom: 20,
    attributionHtml:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
  },
  // Cost/Usage https://account.mapbox.com/
  // Docs https://docs.mapbox.com/data/tilesets/reference/mapbox-satellite/
  // Tileset https://studio.mapbox.com/tilesets/mapbox.satellite/
  {
    id: 'mapbox-satellite',
    name: 'Luftbild Mapbox',
    type: 'raster',
    tiles: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.webp?access_token=${tokenMapboxTilesets}`,
    tileSize: 512,
    minzoom: 0,
    maxzoom: 22,
    attributionHtml: '<a href="https://www.mapbox.com/feedback/">&copy; Mapbox</a>',
  },
  // This is the version from https://github.com/openstreetmap/iD/blob/HEAD/data/manual_imagery.json
  // More: https://github.com/osmlab/editor-layer-index/issues/1451#issuecomment-1057938706
  // maxar_tiles: {
  //   name: 'Maxar',
  //   // type: 'raster',
  //   scheme: 'tms', // `{-y}` in Leaflet https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/#raster-scheme
  //   tiles: [
  //     'https://services.digitalglobe.com/earthservice/tmsaccess/tms/1.0.0/DigitalGlobe:ImageryTileService@EPSG:3857@jpg/{z}/{x}/{y}.jpg?connectId=c2cbd3f2-003a-46ec-9e46-26a3996d6484',
  //   ,
  //   tileSize: 256,
  //   minzoom: 10,
  //   maxzoom: 21,
  //   attribution:
  //     "<a href='https://wiki.openstreetmap.org/wiki/DigitalGlobe'>Terms & Feedback</a>",
  // },
  {
    id: 'areal2023',
    name: 'Berlin: Luftbilder 2023',
    type: 'raster',
    tiles: 'https://tiles.codefor.de/berlin-2023-dop20rgbi/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml:
      '<a target="_blank" href="https://gdi.berlin.de/geonetwork/srv/ger/catalog.search#/metadata/07ec4c16-723f-32ea-9580-411d8fe4f7e7">Geoportal Berlin / Digitale farbige TrueOrthophotos 2023 (DOP20RGBI)</a>',
  },
  {
    id: 'areal2022',
    name: 'Berlin: Luftbilder 2022',
    type: 'raster',
    tiles: 'https://tiles.codefor.de/berlin-2022-dop20rgbi/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml:
      '<a target="_blank" href="https://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=a_luftbild2022_true_rgbi@senstadt&type=FEED">Geoportal Berlin / Digitale farbige TrueOrthophotos 2022 (DOP20RGBI)</a>',
  },
  {
    id: 'areal2021',
    name: 'Berlin: Luftbilder 2021',
    type: 'raster',
    tiles: 'https://tiles.codefor.de/berlin-2021-dop20rgbi/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml:
      '<a target="_blank" href="https://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=a_luftbild2021_rgb@senstadt&type=FEED">Geoportal Berlin / Digitale farbige Orthophotos 2021 (DOP20RGBI)</a>',
  },
  {
    id: 'areal2020',
    name: 'Berlin: Luftbilder 2020',
    type: 'raster',
    tiles: 'https://tiles.codefor.de/berlin-2020-dop20rgb/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml:
      '<a target="_blank" href="https://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=a_luftbild2020_rgb@senstadt&type=FEED">Geoportal Berlin / Digitale farbige Orthophotos 2020 (DOP20RGB)</a>',
  },
  {
    id: 'areal2019',
    name: 'Berlin: Luftbilder 2019',
    type: 'raster',
    tiles: 'https://tiles.codefor.de/berlin-2019-dop20rgb/{z}/{x}/{y}.png',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 21,
    attributionHtml:
      '<a target="_blank" href="https://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=a_luftbild2019_rgb@senstadt&type=FEED">Geoportal Berlin / Digitale farbige Orthophotos 2019 (DOP20RGB)</a>',
  },
  {
    id: 'parkraumkarte_neukoelln',
    name: 'Berlin: Parkraumkarte Neukoelln',
    type: 'raster',
    tiles: 'https://tiles.osm-berlin.org/parkraumkarte/{z}/{x}/{y}.jpg',
    tileSize: 256,
    minzoom: 10,
    maxzoom: 20,
    attributionHtml:
      '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>, Bordsteinkanten: OpenStreetMap und Geoportal Berlin / ALKIS.',
  },
  {
    id: 'cyclosm',
    name: 'CyclOSM',
    type: 'raster',
    tiles: 'https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    // 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    // tileSize: 256, // TODO figure out if we need this
    minzoom: 0,
    maxzoom: 20,
    attributionHtml: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    legendUrl: 'https://www.cyclosm.org/#map={z}/{x}/{y}/cyclosm',
  },
  {
    // https://www.thunderforest.com/maps/opencyclemap/
    id: 'thunderforest-opencyclemap',
    name: 'OpenCycleMap',
    type: 'raster',
    tiles:
      'https://tile.thunderforest.com/cycle/{z}/{x}/{y}{ratio}.png?apikey=27051673860149148c0c2818a0e10dfb',
    tileSize: 512,
    minzoom: 10,
    maxzoom: 22,
    attributionHtml:
      'Maps © <a href="https://www.thunderforest.com">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    legendUrl: 'https://www.opencyclemap.org/docs/',
  },
  // TODO: CORS Problem
  // {
  //   // TODO: Vereinbarung mit https://memomaps.de/ treffen
  //   id: 'memomaps-transport',
  //   name: 'ÖPNV Karte 1',
  //   type: 'raster',
  //   tiles: 'https://tileserver.memomaps.de/tilegen/14/8796/5286.png',
  //   tileSize: 512,
  //   minzoom: 10,
  //   maxzoom: 18,
  //   attributionHtml:
  //     'Maps © <a href="https://memomaps.de/">MeMoMaps</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  // },
  {
    // https://www.thunderforest.com/maps/transport/
    id: 'thunderforest-transport',
    name: 'ÖPNV Karte 2',
    type: 'raster',
    tiles:
      'https://tile.thunderforest.com/transport/{z}/{x}/{y}{ratio}.png?apikey=27051673860149148c0c2818a0e10dfb',
    // tileSize: 512,
    minzoom: 10,
    maxzoom: 22,
    attributionHtml:
      'Maps © <a href="https://www.thunderforest.com">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    // https://www.thunderforest.com/maps/landscape/
    id: 'thunderforest-landscape',
    name: 'Höhenlinien',
    type: 'raster',
    tiles:
      'https://tile.thunderforest.com/landscape/{z}/{x}/{y}{ratio}.png?apikey=27051673860149148c0c2818a0e10dfb',
    // tileSize: 512,
    minzoom: 10,
    maxzoom: 22,
    attributionHtml:
      'Maps © <a href="https://www.thunderforest.com">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    // https://www.thunderforest.com/maps/outdoors/
    id: 'thunderforest-outdoors',
    name: 'Wandern',
    type: 'raster',
    tiles:
      'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}{ratio}.png?apikey=27051673860149148c0c2818a0e10dfb',
    // tileSize: 512,
    minzoom: 10,
    maxzoom: 22,
    attributionHtml:
      'Maps © <a href="https://www.thunderforest.com">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    // Usage allowed as long as "moderate" traffic.
    // https://cycling.waymarkedtrails.org/
    id: 'waymarkedtrails-cycling',
    name: 'Radrouten',
    type: 'raster',
    tiles: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png',
    minzoom: 0,
    maxzoom: 15,
    // TODO the zxy has to go or be fixed, see comment at `const enhancedAttributionHtml`
    attributionHtml:
      'Routenoverlay CC-BY-SA <a href="https://cycling.waymarkedtrails.org/#?map={z}/{x}/{y}">Waymarked Trails</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    legendUrl: 'https://cycling.waymarkedtrails.org/#?map={z}/{x}/{y}',
  },
  {
    // Usage allowed as long as "moderate" traffic.
    // https://hiking.waymarkedtrails.org/
    id: 'waymarkedtrails-hiking',
    name: 'Wanderrouten',
    type: 'raster',
    tiles: 'https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png',
    minzoom: 0,
    maxzoom: 15,
    // TODO the zxy has to go or be fixed, see comment at `const enhancedAttributionHtml`
    attributionHtml:
      'Routenoverlay CC-BY-SA <a href="https://hiking.waymarkedtrails.org/#?map={z}/{x}/{y}">Waymarked Trails</a>, Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    legendUrl: 'https://hiking.waymarkedtrails.org/#?map={z}/{x}/{y}',
  },
  {
    // Usage allowed as long as "moderate" traffic.
    // https://hiking.waymarkedtrails.org/
    id: 'opentopomap',
    name: 'OpenTopoMap',
    type: 'raster',
    tiles: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
    minzoom: 0,
    maxzoom: 17,
    attributionHtml:
      'Kartendaten: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Kartendarstellung: © <a href="http://opentopomap.org">OpenTopoMap</a>',
    legendUrl: 'https://opentopomap.org/about#legende',
  },
  {
    // https://dienste.btfietz.de/kommsvz/ttw_radwege/wms?request=getCapabilities
    // https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/
    id: 'trto-radwege',
    name: 'Amtliche Radwege',
    type: 'raster',
    tiles:
      'https://dienste.btfietz.de/kommsvz/ttw_radwege/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=839&HEIGHT=878&LAYERS=radweg&STYLES=&FORMAT=image/png&DPI=72&MAP_RESOLUTION=72&FORMAT_OPTIONS=dpi:72&TRANSPARENT=TRUE',
    minzoom: 0,
    maxzoom: 15,
    attributionHtml: 'Amt Treptower Tollensewinkel',
    legendUrl: undefined,
  },
]

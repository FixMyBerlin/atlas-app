import { SourceExportApiIdentifier } from '@/src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { StaticRegion } from '@/src/data/regions.const'

// Configruation:
// BBox: Brandenburg
const bboxBrandenburg = {
  min: [11.2662278, 51.359064],
  max: [14.7658159, 53.5590907],
} satisfies StaticRegion['bbox']
// BBox: A bit of Berlin and rual areas below (NUDAFA)
// const bboxBerlinPlus = {
//   min: [13.2809, 52.2095],
//   max: [13.825, 52.5528],
// } satisfies StaticRegion['bbox']
// BBox: Whole Germany
const bboxPartOfNorthGermany = {
  min: [6.635773437502678, 50.666899472786724],
  max: [13.842804687502621, 53.422653072698324],
} satisfies StaticRegion['bbox']

// Datasets:
export const tilesetConfigs: Record<
  SourceExportApiIdentifier,
  { sourceLayer: string; uploadUrl: string; bbox: NonNullable<StaticRegion['bbox']> }
> = {
  bicycleParking_points: {
    sourceLayer: 'bicycleParking_points',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.c65ckqta/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  bicycleParking_areas: {
    sourceLayer: 'bicycleParking_areas',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.0p8hdib5/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  bikelanes: {
    sourceLayer: 'bikelanes_verified', // Note: Fixed name
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.3i25sspf/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  places: {
    sourceLayer: 'tarmac-places-test-datensatz-5dodjb',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.34e901wi/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  poiClassification: {
    sourceLayer: 'poiClassification',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.0wsdyx91/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  publicTransport: {
    sourceLayer: 'publicTransport',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.7fmhzgpi/#14/52.51622/13.39233',
    bbox: bboxPartOfNorthGermany,
  },
  trafficSigns: {
    sourceLayer: 'atlas-trafficSigns-attp60',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.8trg6z1b/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  landuse: {
    sourceLayer: 'tarmac-landuse-test-datensatz-0r36t3',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.8xhph4k4/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  barrierAreas: {
    sourceLayer: 'atlas-barrierAreas-b9mb1o',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.3m06nhmv/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  barrierLines: {
    sourceLayer: 'atlas-barrierLines-3ft1bu',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.cx602vbw/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  boundaries: {
    sourceLayer: 'atlas-boundaries-66z5h4',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.4u44tl11/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  boundaryLabels: {
    sourceLayer: 'atlas_boundariesLabel-1q1c4n',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.cuem4dsu/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  roads: {
    sourceLayer: 'roads',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.0f7p6nhx/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  roadsPathClasses: {
    sourceLayer: 'roadsPathClasses',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.ajf6t9k7/#14/52.51622/13.37036',
    bbox: bboxBrandenburg,
  },
  bikelanesPresence: {
    sourceLayer: 'bikelanesPresence',
    uploadUrl: '', //
    bbox: bboxPartOfNorthGermany,
  },
  bikeSuitability: {
    sourceLayer: 'bikeSuitability',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.6s7gn4lg/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  bikeroutes: {
    sourceLayer: 'bikeroutes',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.7h5266ql/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
  // There is no export function for the statistics table, so we cannot use this script to update the data.
  // See `app/src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier.ts` for more.
  // aggregated_lengths: {
  //   sourceLayer: 'aggregated_lengths',
  //   uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.TODO/#14/52.51622/13.37036',
  //   bbox: bboxPartOfNorthGermany,
  // },
  todos_lines: {
    sourceLayer: 'todos_lines',
    uploadUrl: 'https://studio.mapbox.com/tilesets/hejco.1yvm8bes/#14/52.51622/13.37036',
    bbox: bboxPartOfNorthGermany,
  },
}

import { TableId } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/tables.const'

export type InteracitvityConfiguartion = Record<TableId, { minzoom: number; stylingKeys: string[] }>
export const interactivityConfiguration: InteracitvityConfiguartion = {
  roads: {
    stylingKeys: [
      'road',
      'road_oneway',
      'road_oneway:bicycle',
      'lit',
      'lit_age',
      'maxspeed',
      'smoothness',
      'surface',
      'smoothness_age',
      'bikelane_left',
      'bikelane_right',
      'bikelane_self',
    ],
    minzoom: 9,
  },
  roadsPathClasses: {
    stylingKeys: ['road'],
    minzoom: 9,
  },
  bikelanesPresence: {
    stylingKeys: ['bikelane_left', 'bikelane_self', 'bikelane_right'],
    minzoom: 0,
  },
  bikelanes: {
    stylingKeys: ['category', 'surface', 'smoothness', 'width'],
    minzoom: 9,
  },
  places: {
    stylingKeys: ['place', 'name', 'population'],
    minzoom: 8,
  },
  poiClassification: {
    stylingKeys: ['category', 'name', 'formalEducation', 'amenity'],
    minzoom: 13,
  },
  barrierAreas: {
    stylingKeys: [],
    minzoom: 9,
  },
  barrierLines: {
    stylingKeys: ['birdge', 'tunnel', 'railway', 'highway'],
    minzoom: 9,
  },
  bicycleParking_areas: {
    stylingKeys: [],
    minzoom: 9,
  },
  bicycleParking_points: {
    stylingKeys: ['covered'],
    minzoom: 9,
  },
  bikeroutes: {
    stylingKeys: ['network', 'ref', 'cycle_highway'],
    minzoom: 9,
  },
  boundaries: {
    stylingKeys: ['category_municipality', 'category_district', 'name', 'name:prefix'],
    minzoom: 0,
  },
  boundaryLabels: {
    stylingKeys: ['category_municipality', 'name:prefix', 'category_district'],
    minzoom: 0,
  },
  landuse: {
    stylingKeys: ['landuse'],
    minzoom: 11,
  },
  publicTransport: {
    stylingKeys: ['category'],
    minzoom: 11,
  },
  trafficSigns: {
    stylingKeys: [],
    minzoom: 0,
  },
}

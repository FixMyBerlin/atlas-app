import { MakeGenerics, ReactLocation, Route } from '@tanstack/react-location'
import { MapDataConfigTheme } from '../components/MapInterface/Map/mapData'
import { MapDataConfigThemeIds } from '../components/MapInterface/Map/mapData/themesMapDataConfig'
import { MapDataConfigTopicsWithState } from '../components/MapInterface/store/mapDataConfigTopicsWithState'
import {
  Page404,
  PageContact,
  PageHome,
  PagePrivacy,
  PageRegionAction,
  PageRegionMap,
  PageRegions,
  Region,
} from '@pages/index'
import { fetchRegionByPath } from './fetchRegionByPath'
import { fetchRegions } from './fetchRegions'

// LoaderData: LoaderData<unknown>;
// Params: Params<string>;
// Search: Search<unknown>;
// RouteMeta: RouteMeta<unknown>;
export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    regions: Region[]
    region: Region
  }
  Params: {
    regionPath: string
  }
  Search: {
    regionPathNotFound: string
    theme: MapDataConfigThemeIds
    lat: number
    lng: number
    zoom: number
    config: MapDataConfigTopicsWithState
  }
}>

export const location = new ReactLocation<LocationGenerics>()

export const routes: Route<LocationGenerics>[] = [
  {
    path: '/',
    element: <PageHome />,
  },
  {
    path: '/regionen',
    children: [
      {
        path: '/',
        element: <PageRegions />,
        loader: async () => {
          return { regions: await fetchRegions() }
        },
      },
      {
        path: ':regionPath',
        children: [
          {
            path: '/',
            element: <PageRegionMap />,
            loader: async ({ params: { regionPath } }) => {
              return {
                region: await fetchRegionByPath(regionPath),
              }
            },
            // TODO figure out how to use the error-Handling to catch non-existing regionPath's
            // errorElement: <PageMapIndex regionPathNotFound />,
          },
          {
            path: '/mitmachen',
            element: <PageRegionAction />,
            loader: async ({ params: { regionPath } }) => {
              return {
                region: await fetchRegionByPath(regionPath),
              }
            },
          },
        ],
      },
    ],
  },
  {
    path: '/kontakt',
    element: <PageContact />,
  },
  {
    path: '/datenschutz',
    element: <PagePrivacy />,
  },
  {
    path: '*',
    element: <Page404 />,
  },
]

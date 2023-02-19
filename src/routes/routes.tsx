import { DrawArea } from '@components/MapInterface/Map/Calculator/CalculatorControlsDrawControl'
import { SourcesRasterIds } from '@components/MapInterface/mapData'
import { Region } from '@fakeServer/index'
import { ContactPage, HomePage, NotFoundPage, PrivacyPage } from '@pages/index'
import { PageRegionMap, PageRegions } from '@pages/PageRegions'
import {
  MakeGenerics,
  parseSearchWith,
  ReactLocation,
  Route,
  stringifySearchWith,
} from '@tanstack/react-location'
import jsurl from 'jsurl2'
import { MapDataThemeIds } from '../components/MapInterface/mapData/themesMapData'
import { ThemeConfig } from '../components/MapInterface/mapStateConfig'
import { fetchRegions } from './fetchRegions'
import { updateLegacyEncoding } from './legacyEncodeDecode'
import { fetchRegionByPath } from './utils/fetchRegionByPath'

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
    theme: MapDataThemeIds
    lat: number
    lng: number
    zoom: number
    bg: SourcesRasterIds
    config: ThemeConfig[]
    draw: DrawArea[]
  }
}>

// Docs: https://react-location.tanstack.com/guides/custom-search-param-serialization#using-jsurl
// Using https://github.com/wmertens/jsurl2
export const location = new ReactLocation({
  parseSearch: parseSearchWith((value) =>
    jsurl.parse(updateLegacyEncoding(value))
  ),
  stringifySearch: stringifySearchWith((value) => jsurl.stringify(value)),
})

export const routes: Route<LocationGenerics>[] = [
  {
    path: '/',
    element: <HomePage />,
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
            // errorElement: <MapIndexPage regionPathNotFound />,
          },
          // {
          //   path: '/mitmachen',
          //   element: <PageRegionAction />,
          //   loader: async ({ params: { regionPath } }) => {
          //     return {
          //       region: await fetchRegionByPath(regionPath),
          //     }
          //   },
          // },
        ],
      },
    ],
  },
  // TODO Deactivated for now
  // {
  //   path: '/ueber',
  //   element: <AboutPage />,
  // },
  {
    path: '/kontakt',
    element: <ContactPage />,
  },
  {
    path: '/datenschutz',
    element: <PrivacyPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

import { MakeGenerics, ReactLocation, Route } from '@tanstack/react-location'
import {
  PageContact,
  PageHome,
  PageMapIndex,
  PageMapRegion,
  PagePrivacy,
  Region,
} from '../pages'
import Page404 from '../pages/Page404'
import { fetchRegions } from './fetchRegions'

// LoaderData: LoaderData<unknown>;
// Params: Params<string>;
// Search: Search<unknown>;
// RouteMeta: RouteMeta<unknown>;
export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    regions: Region[]
  }
  Params: {
    regionPath: string
  }
  Search: {
    notFound: string
    showNotes: boolean
    notes: string
    usersView: {
      sortBy?: 'name' | 'id' | 'email'
      filterBy?: string
    }
  }
}>

export const location = new ReactLocation<LocationGenerics>()

export const routes: Route<LocationGenerics>[] = [
  { path: '/', element: <PageHome /> },
  {
    // LATER: Add route loaders once we have a DB https://react-location.tanstack.com/guides/route-loaders
    path: '/karte',
    children: [
      {
        path: '/',
        element: <PageMapIndex />,
        loader: async () => {
          return { regions: await fetchRegions() }
        },
      },
      {
        path: ':regionPath',
        element: <PageMapRegion />,
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

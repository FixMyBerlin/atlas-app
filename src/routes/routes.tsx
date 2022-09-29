import { MakeGenerics, ReactLocation, Route } from '@tanstack/react-location'
import { PageContact, PageHome, PageMap, PagePrivacyStatement } from '../pages'
import Page404 from '../pages/Page404'

// LoaderData: LoaderData<unknown>;
// Params: Params<string>;
// Search: Search<unknown>;
// RouteMeta: RouteMeta<unknown>;
type LocationGenerics = MakeGenerics<{
  LoaderData: {
    expensiveTimestamp: number
    reallyExpensiveTimestamp: number
  }
  Params: {
    invoiceId: string
    userId: string
  }
  Search: {
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
  { path: '/map', element: <PageMap /> },
  {
    path: '/kontakt',
    element: <PageContact />,
  },
  {
    path: '/datenschutz',
    element: <PagePrivacyStatement />,
  },
  {
    path: '*',
    element: <Page404 />,
  },
]

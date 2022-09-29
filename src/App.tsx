import { Outlet, Router,ReactLocation,MakeGenerics,Route } from "@tanstack/react-location";
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';
import './App.css';

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    expensiveTimestamp: number;
    reallyExpensiveTimestamp: number;
  };
  Params: {
    invoiceId: string;
    userId: string;
  };
  Search: {
    showNotes: boolean;
    notes: string;
    usersView: {
      sortBy?: "name" | "id" | "email";
      filterBy?: string;
    };
  };
}>;

const location = new ReactLocation<LocationGenerics>();


// Build our routes. We could do this in our component, too.
const routes: Route<LocationGenerics>[] = [
  { path: "/", element: <h1>Home</h1> },
  {
    path: "dashboard",
    element: <h1>dashboard</h1>,
  },
];

const App = () => {
  return (
     <Router
          location={location}
          routes={routes}>
       <Outlet />
       <ReactLocationDevtools initialIsOpen={false} />
     </Router>
  )
}

export default App

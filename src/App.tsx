import { Outlet, Router } from '@tanstack/react-location'
import { ReactLocationDevtools } from '@tanstack/react-location-devtools'
import { location, routes } from './routes'

const App = () => {
  return (
    <Router location={location} routes={routes}>
      <main>
        <Outlet />
      </main>
      <ReactLocationDevtools initialIsOpen={false} />
    </Router>
  )
}

export default App

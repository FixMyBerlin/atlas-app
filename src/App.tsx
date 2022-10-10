import { Outlet, Router } from '@tanstack/react-location'
import { location, routes } from './routes'

const App = () => {
  return (
    <Router location={location} routes={routes}>
      <main className="relative flex-auto">
        <Outlet />
      </main>
    </Router>
  )
}

export default App

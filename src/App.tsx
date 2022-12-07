import { Outlet, Router } from '@tanstack/react-location'
import { location, routes } from './routes'

const App = () => {
  return (
    <Router location={location} routes={routes}>
      <div className="relative flex-auto">
        <Outlet />
      </div>
    </Router>
  )
}

export default App

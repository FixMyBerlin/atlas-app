import { Outlet, Router } from '@tanstack/react-location'
import { location, routes } from './TODO-MIRGRATE-REMOVE'

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

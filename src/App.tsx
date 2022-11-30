import { isDev, isProd, isStaging } from '@components/utils'
import { Outlet, Router } from '@tanstack/react-location'
import { location, routes } from './routes'

const App = () => {
  return (
    <Router location={location} routes={routes}>
      <div
        className="relative flex-auto"
        data-env={JSON.stringify({
          isProd,
          isStaging,
          isDev,
          vite_mode: import.meta.env.MODE,
          custom: import.meta.env.VITE_NETLIFY_CONTEXT,
        })}
      >
        <Outlet />
      </div>
    </Router>
  )
}

export default App

import { Navigate, useMatch } from '@tanstack/react-location'
import { regionFromPath } from './regions'

export const PageMapRegion: React.FC = () => {
  const {
    params: { regionPath },
  } = useMatch()

  const region = regionFromPath(regionPath)

  if (region === undefined) {
    return <Navigate to="/karte" search={{ notFound: regionPath }} />
  }

  return (
    <h1>
      {regionPath}: {JSON.stringify(region)}
    </h1>
  )
  return <>{/* <MapInterface region={region} /> */}</>
}

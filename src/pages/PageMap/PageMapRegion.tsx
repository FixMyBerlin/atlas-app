import { Navigate, useMatch } from '@tanstack/react-location'

export const PageMapRegion: React.FC = () => {
  const {
    data: { region },
    params: { regionPath },
  } = useMatch()

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

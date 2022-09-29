import { Navigate, useMatch } from '@tanstack/react-location'

export const PageRegionMap: React.FC = () => {
  const {
    data: { region },
    params: { regionPath },
  } = useMatch()

  if (region === undefined) {
    return <Navigate to="/regionen" search={{ notFound: regionPath }} />
  }

  return (
    <h1>
      MAP {regionPath}: {JSON.stringify(region)}
    </h1>
  )
  return <>{/* <MapInterface region={region} /> */}</>
}

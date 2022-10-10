import { LayoutMapPage } from '@components/Layout'
import { Navigate, useMatch } from '@tanstack/react-location'

export const PageRegionAction: React.FC = () => {
  const {
    data: { region },
    params: { regionPath },
  } = useMatch()

  if (region === undefined) {
    return (
      <Navigate to="/regionen" search={{ regionPathNotFound: regionPath }} />
    )
  }

  return (
    <LayoutMapPage>
      <h1>
        ACTION {regionPath}: {JSON.stringify(region)}
      </h1>
    </LayoutMapPage>
  )
}

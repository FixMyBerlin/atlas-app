import { Layout } from '@components/Layout'
import { Link, useMatch } from '@tanstack/react-location'
import { LocationGenerics } from '../../routes'

export const PageRegions: React.FC = () => {
  const {
    data: { regions },
    search: { regionPathNotFound },
  } = useMatch<LocationGenerics>()

  return (
    <Layout>
      {!!regionPathNotFound && (
        <p>
          <code>{regionPathNotFound}</code> konnte nicht gefunden werden.
        </p>
      )}
      <h1>Bitte wähle eine Region:</h1>
      <ul>
        {regions?.map((region) => {
          return (
            <li key={region.path}>
              <Link to={`/regionen/${region.path}`}>{region.name}</Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

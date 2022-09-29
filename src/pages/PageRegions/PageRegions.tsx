import { Link, useMatch } from '@tanstack/react-location'
import { LocationGenerics } from '../../routes'

export const PageRegions: React.FC = () => {
  const {
    data: { regions },
    search: { notFound },
  } = useMatch<LocationGenerics>()

  return (
    <>
      {!!notFound && (
        <p>
          <code>{notFound}</code> konnte nicht gefunden werden.
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
    </>
  )
}

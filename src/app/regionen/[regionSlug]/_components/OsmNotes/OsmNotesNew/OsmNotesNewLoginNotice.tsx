import { buttonStylesOnYellow } from 'src/app/_components/links/styles'
import { useStartUserLogin } from 'src/users/hooks/useStartUserLogin'

export const OsmNotesNewLoginNotice = () => {
  const handleLogin = useStartUserLogin()
  return (
    <section className="prose p-5">
      <h1 className="text-xl">
        Um Hinweise auf OpenStreetMap zu veröffentliche, müssen Sie eingeloggt sein.
      </h1>
      <button onClick={handleLogin} className={buttonStylesOnYellow}>
        Anmelden (oder registrieren)
      </button>
    </section>
  )
}

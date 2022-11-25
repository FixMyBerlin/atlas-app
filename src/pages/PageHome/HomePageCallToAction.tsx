import { WaitlistButton } from './components'
import backgroundImage from './images/background-call-to-action.jpg'

export const HomePageCallToAction = () => {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <img
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
      />
      <div className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Sie haben auch Interesse?
          </h2>
          <p className="my-4 text-lg tracking-tight text-white">
            Sie möchten informiert bleiben und den Radverkehrsatlas als
            Pilotkommune nutzen? Tragen Sie sich für die Warteliste ein.
          </p>
          <WaitlistButton />
        </div>
      </div>
    </section>
  )
}

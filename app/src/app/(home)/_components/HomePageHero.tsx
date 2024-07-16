import { WaitlistButton } from './buttons/WaitlistButton'

export const HomePageHero: React.FC = () => {
  return (
    <section className="lg:px-8pt-20 mx-auto max-w-7xl px-4 pt-6 text-center sm:px-6 lg:pt-32">
      <h1 className="font-display mx-auto max-w-4xl text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl sm:font-medium md:text-7xl">
        Offene Daten für die <span className="text-yellow-500">Radverkehrsplanung</span>. Nachhaltig
        und verifizierbar.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700">
        Der Radverkehrsatlas unterstützt die kommunale Radverkehrsplanung, indem er umfassende und
        amtlich nutzbare Daten für die Radverkehrsplanung liefert. Gemeinsam mit Bürger:innen werden
        die Daten fortlaufend verbessert und aktuell gehalten.
      </p>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700">
        Das Forschungsprojekt befindet sich in der Pilotphase, melden Sie sich für die Warteliste
        an, um den Radverkehrsatlas in der Beta-Phase nutzen zu können und Benachrichtigungen zu
        Updates zu bekommen.
      </p>
      <div className="text-md mx-auto mt-6 max-w-2xl tracking-tight text-gray-700 sm:text-lg">
        <WaitlistButton />
      </div>
    </section>
  )
}

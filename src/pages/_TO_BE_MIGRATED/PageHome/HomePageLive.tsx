import { Link } from '@components/Link'
import screenshotBiBi from './images/HomePageLive/bibi.jpg'
import screenshotTrTo from './images/HomePageLive/trto.jpg'
import screenshotNudafa from './images/HomePageLive/zes.jpg'

type Callout = {
  name: string
  description: string
  image: React.ReactNode
  imageAlt: string
  href: string
}

const callouts: Callout[] = [
  {
    name: 'Bietigheim-Bissingen',
    description: 'OpenData zu Beleuchtung',
    image: screenshotBiBi,
    imageAlt: '',
    href: '/regionen/bibi',
  },
  {
    name: 'NUDAFA',
    description:
      'Der Radverkehrsatlas eingebettet in ein laufendes Projekten der Radnetz- und Maßnahmenplanung.',
    image: screenshotNudafa,
    imageAlt: '',
    href: 'https://www.nudafa.de/radnetzplanung',
  },
  {
    name: 'Treptower Tollensewinkel',
    description: 'Radinfrastruktur als OpenData',
    image: screenshotTrTo,
    imageAlt: '',
    href: '/regionen/trto',
  },
]

export const HomePageLive = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-16 text-center sm:py-24 lg:max-w-none lg:py-32">
        <h2 className="font-display text-3xl tracking-tight text-gray-900 sm:text-4xl">
          Den Radverkehrsatlas live erleben (beta)
        </h2>
        <p className="mt-4 text-lg tracking-tight text-gray-700">
          Hier können Sie die ersten Ergebnisse aus den noch laufenden Projekten einsehen – mehr ist
          in Arbeit.
        </p>

        <div className="mt-6 justify-center space-y-10 lg:flex lg:gap-x-6 lg:space-y-0">
          {callouts.map((callout) => (
            <Link
              to={callout.href}
              external={callout.href.startsWith('http')}
              key={callout.name}
              classNameOverwrite="block group relative lg:max-w-[26rem]"
            >
              <div className="sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:h-64">
                <img
                  src={callout.image as string}
                  alt={callout.imageAlt}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-6 text-base font-semibold text-gray-900 group-hover:underline">
                {callout.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                <span className="absolute inset-0" />
                {callout.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

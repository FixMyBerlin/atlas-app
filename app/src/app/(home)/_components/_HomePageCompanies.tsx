import imageBiBi from '@/src/app/_components/assets/bibi-logo.svg'
import imageNudafa from '@/src/app/_components/assets/nudafa-logo.svg'
import imageTrTo from '@/src/app/_components/assets/trto-logo.png'
import Image from 'next/image'

export const HomePageCompanies: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 text-center sm:px-6 lg:px-8">
      <div className="mt-36 lg:mt-24">
        <p className="font-display text-3xl tracking-tight text-gray-900 sm:text-4xl">
          Pilot-Kommunen, die TILDA nutzen
        </p>
        <ul className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0">
          {[
            [
              {
                name: 'Bietigheim-Bissingen',
                logo: imageBiBi,
              },
              {
                name: 'Treptower Tollensewinkel',
                logo: imageTrTo,
              },
              { name: 'NUDAFA', logo: imageNudafa },
            ],
          ].map((group, groupIndex) => (
            <li key={groupIndex}>
              <ul className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
                {group.map((region) => (
                  <li key={region.name} className="flex">
                    <Image src={region.logo} alt={region.name} className="h-10 w-auto" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

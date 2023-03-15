export const HomePageCompanies: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 text-center sm:px-6 lg:px-8">
      <div className="mt-36 lg:mt-24">
        <p className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
          Pilot-Kommunen, die den Radverkehrsatlas nutzen
        </p>
        <ul className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0">
          {[
            [
              {
                name: 'Bietigheim-Bissingen',
                logo: '/pageRegions/bibi-logo.svg',
              },
              {
                name: 'Treptower Tollensewinkel',
                logo: '/pageRegions/trto-logo.png',
              },
              { name: 'NUDAFA', logo: '/pageRegions/zesplus-logo.png' },
            ],
          ].map((group, groupIndex) => (
            <li key={groupIndex}>
              <ul className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
                {group.map((region) => (
                  <li key={region.name} className="flex">
                    <img src={region.logo} alt={region.name} className="h-10 w-auto" />
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

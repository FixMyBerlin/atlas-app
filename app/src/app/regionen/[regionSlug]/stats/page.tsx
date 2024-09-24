import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import { proseClasses } from 'src/app/_components/text/prose'
import { ObjectDump } from 'src/app/admin/_components/ObjectDump'
import { invoke } from 'src/blitz-server'
import { geoDataClient } from 'src/prisma-client'
import getRegion from 'src/regions/queries/getRegion'
import { twJoin } from 'tailwind-merge'
import { hackyIdListForBB } from './list.const'

export async function generateMetadata({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })

  return {
    robots: 'noindex',
    title: { absolute: `STATS ${region?.fullName} im Radverkehrsatlas` },
  }
}

export default async function ShowRegionStatsPage({ params, searchParams }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })
  const stats = await geoDataClient.$queryRaw<any>`
      SELECT osm_id::numeric, tags->'name', tags, meta, presence_categories
      FROM public."presenceStats"
      WHERE osm_id::text = ANY(${hackyIdListForBB.map(String)})`

  const missingDataKeys = ['missing_km']
  const implicitDataKeys = ['assumed_no_km', 'not_expected_km']

  const filteredStats = stats.filter((stat) => {
    switch (searchParams?.filter) {
      case 'municipality':
        return stat.tags?.category_municipality
      case 'district':
        return stat.tags?.category_district
      default:
        return true
    }
  })

  return (
    <div className={twJoin(proseClasses, 'mx-auto max-w-prose')}>
      <h1>
        Stats für {region.fullName} ({filteredStats.length})
      </h1>

      <div className="flex gap-2">
        <Link href={'?filter='}>Alle Daten</Link>
        <Link href={'?filter=municipality'}>Nur Gemeinden</Link>
        <Link href={'?filter=district'}>Nur Landkreise</Link>
      </div>

      {filteredStats.map((stat) => {
        const presenceStats = stat.presence_categories
        const total = Object.values(presenceStats).reduce(
          (acc: number, curValue: number) => acc + curValue,
          0,
        ) as number
        const missingDataTotal = Object.entries(presenceStats)
          .filter(([key, _]) => missingDataKeys.includes(key))
          .reduce((acc: number, [_, curValue]: [string, number]) => acc + curValue, 0) as number
        const implicitDataTotal = Object.entries(presenceStats)
          .filter(([key, _]) => implicitDataKeys.includes(key))
          .reduce((acc: number, [_, curValue]: [string, number]) => acc + curValue, 0) as number
        const explicitDataTotal = total - missingDataTotal - implicitDataTotal

        return (
          <section key={stat.osm_id}>
            <h2>
              {stat.tags?.category_municipality} {stat.tags?.category_district} {stat.tags.name}
            </h2>
            <ObjectDump data={stat} />
            <details className="rounded open:border open:border-gray-300 open:p-2">
              <summary className={twJoin(linkStyles, 'cursor-pointer whitespace-nowrap')}>
                Daten pro Kategorie
              </summary>
              <table>
                <tbody>
                  {Object.entries(presenceStats).map(([key, value]) => {
                    const km = Number(value)
                    const highlightRow = implicitDataKeys.includes(key)
                    const highlightMissing = missingDataKeys.includes(key)
                    return (
                      <tr
                        key={key}
                        className={
                          highlightRow ? 'bg-gray-100' : highlightMissing ? 'bg-red-50' : ''
                        }
                      >
                        <td className={highlightRow || highlightMissing ? 'font-semibold' : ''}>
                          {key}
                        </td>
                        <td>
                          {km.toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}{' '}
                          km
                        </td>
                        <td>
                          {(km / total).toLocaleString(undefined, {
                            style: 'percent',
                            minimumFractionDigits: 1,
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </details>

            <table>
              <tbody>
                <tr>
                  <th>Explizite Daten</th>
                  <td className="text-right">
                    {explicitDataTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{' '}
                    km
                  </td>
                  <td className="text-right">
                    {(explicitDataTotal / total).toLocaleString(undefined, {
                      style: 'percent',
                      minimumFractionDigits: 1,
                    })}
                  </td>
                </tr>
                <tr>
                  <th>Implizite Daten</th>
                  <td className="text-right">
                    {implicitDataTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{' '}
                    km
                  </td>
                  <td className="text-right">
                    {(implicitDataTotal / total).toLocaleString(undefined, {
                      style: 'percent',
                      minimumFractionDigits: 1,
                    })}
                  </td>
                </tr>
                <tr>
                  <th>Fehlende Daten</th>
                  <td className="text-right">
                    {missingDataTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{' '}
                    km
                  </td>
                  <td className="text-right">
                    {(missingDataTotal / total).toLocaleString(undefined, {
                      style: 'percent',
                      minimumFractionDigits: 1,
                    })}
                  </td>
                </tr>
                <tr>
                  <th>Gesamt</th>
                  <td className="text-right">
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{' '}
                    km
                  </td>
                  <td className="text-right" />
                </tr>
              </tbody>
            </table>
          </section>
        )
      })}
      <h1>Region:</h1>
      <ObjectDump data={region} />
    </div>
  )
}

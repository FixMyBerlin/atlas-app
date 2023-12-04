import { proseClasses } from 'src/app/_components/text/prose'
import { invoke } from 'src/blitz-server'
import { prismaClientForRawQueries } from 'src/prisma-client'
import getRegion from 'src/regions/queries/getRegion'
import { twJoin } from 'tailwind-merge'

export async function generateMetadata({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })

  return {
    robots: 'noindex',
    title: { absolute: `STATS ${region?.fullName} im Radverkehrsatlas` },
  }
}

export default async function ShowRegionStatsPage({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })
  const stats = (await prismaClientForRawQueries.$queryRaw`
      SELECT osm_id::numeric, admin_level, region, bikelanes_category
      FROM public."boundaryStats"
      WHERE osm_id::text IN (${region.osmRelationIds.map(String).join(',') || '62422'})`) as any

  return (
    <div className={twJoin(proseClasses, 'mx-auto max-w-prose')}>
      <h1>Stats für {region.fullName}</h1>
      {stats.map((stat) => {
        const bikelaneStats = stat.bikelanes_category
        const total = Object.values(bikelaneStats).reduce(
          (acc: number, cur: number) => acc + cur,
          0,
        ) as number
        return (
          <section key={stat.osm_id}>
            <h2>{stat.region}</h2>
            <table>
              <tbody>
                {Object.entries(bikelaneStats).map(([key, value]) => {
                  const km = Number(value)
                  return (
                    <tr key={key}>
                      <td>{key}</td>
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
              <tfoot>
                <tr>
                  <td>Gesamt</td>
                  <td>
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{' '}
                    km
                  </td>
                  <td>
                    {(total / total).toLocaleString(undefined, {
                      style: 'percent',
                      minimumFractionDigits: 1,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>
        )
      })}
      <pre>
        {JSON.stringify(
          stats,
          // (key, value) => (typeof value === 'bigint' ? value.toString() : value),
          undefined,
          2,
        )}
      </pre>
      <pre>{JSON.stringify(region, undefined, 2)}</pre>
    </div>
  )
}

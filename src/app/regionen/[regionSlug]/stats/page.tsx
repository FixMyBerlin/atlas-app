import { proseClasses } from 'src/app/_components/text/prose'
import { ObjectDump } from 'src/app/admin/_components/ObjectDump'
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

  await prismaClientForRawQueries.$queryRaw`SET search_path TO public`

  const sqlInputRegionIdList = region.osmRelationIds.map(String).join(',') || '62422'
  const sqlInputBufferRadius = 1000 // 1 km
  // type QueryTpye = { geom: string }[]
  // const sqlBufferedRegionGeom = await prismaClientForRawQueries.$queryRaw<QueryTpye>`
  //   SELECT ST_Buffer(boundaries.geom, 1000) as geom
  //   FROM public."boundaries" as boundaries
  //   WHERE boundaries.osm_id IN (${sqlInputRegionIdList})
  // `
  type QueryTpye = { geom: string }[]
  const sqlBufferedRegionGeom = await prismaClientForRawQueries.$queryRaw<QueryTpye>`
    SELECT *
    FROM public."presenceStats"
    WHERE osm_id::numeric in (
      SELECT osm_id::numeric
      FROM public."boundaries"
      WHERE ST_Contains(
        (SELECT geom FROM public."boundaries" WHERE osm_id IN (62504)),
        geom
      )
    )
  `

  console.info('xxx', sqlBufferedRegionGeom)
  return <pre>JSON.stringify(sqlBufferedRegionGeom, undefined, 2)</pre>
  // const relationIdsInRegion = (await prismaClientForRawQueries.$queryRaw`
  //   SELECT a.osm_id::numeric, a.tags->'name'
  //   FROM public."boundaries" a, public."boundaries" b
  //   WHERE ST_Contains(b.geom, a.geom)
  //   AND b.osm_id::text IN (${region.osmRelationIds.map(String).join(',') || '62422'})`) as any
  // const stats = (await prismaClientForRawQueries.$queryRaw`
  //     SELECT osm_id::numeric, tags->'name', tags, meta, presence_categories
  //     FROM public."presenceStats"
  //     WHERE osm_id::text IN (${region.osmRelationIds.map(String).join(',') || '62422'})`) as any

  // return (
  //   <div className={twJoin(proseClasses, 'mx-auto max-w-prose')}>
  //     <h1>Stats für {region.fullName}</h1>
  //     <ObjectDump data={stats} />

  //     {stats.map((stat) => {
  //       const presenceStats = stat.presence_categories
  //       const total = Object.values(presenceStats).reduce(
  //         (acc: number, cur: number) => acc + cur,
  //         0,
  //       ) as number
  //       return (
  //         <section key={stat.osm_id}>
  //           <h2>{stat.region}</h2>
  //           <table>
  //             <tbody>
  //               {Object.entries(presenceStats).map(([key, value]) => {
  //                 const km = Number(value)
  //                 return (
  //                   <tr key={key}>
  //                     <td>{key}</td>
  //                     <td>
  //                       {km.toLocaleString(undefined, {
  //                         minimumFractionDigits: 1,
  //                         maximumFractionDigits: 1,
  //                       })}{' '}
  //                       km
  //                     </td>
  //                     <td>
  //                       {(km / total).toLocaleString(undefined, {
  //                         style: 'percent',
  //                         minimumFractionDigits: 1,
  //                       })}
  //                     </td>
  //                   </tr>
  //                 )
  //               })}
  //             </tbody>
  //             <tfoot>
  //               <tr>
  //                 <td>Gesamt</td>
  //                 <td>
  //                   {total.toLocaleString(undefined, {
  //                     minimumFractionDigits: 1,
  //                     maximumFractionDigits: 1,
  //                   })}{' '}
  //                   km
  //                 </td>
  //                 <td>
  //                   {(total / total).toLocaleString(undefined, {
  //                     style: 'percent',
  //                     minimumFractionDigits: 1,
  //                   })}
  //                 </td>
  //               </tr>
  //             </tfoot>
  //           </table>
  //         </section>
  //       )
  //     })}
  //     <pre>
  //       {JSON.stringify(
  //         stats,
  //         // (key, value) => (typeof value === 'bigint' ? value.toString() : value),
  //         undefined,
  //         2,
  //       )}
  //     </pre>
  //     <pre>{JSON.stringify(region, undefined, 2)}</pre>
  //   </div>
  // )
}

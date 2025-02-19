'use client'
import { Link } from '@/src/app/_components/links/Link'
import { staticRegion } from '@/src/app/regionen/(index)/_data/regions.const'
import { TRegion } from '@/src/server/regions/queries/getRegion'
import { ObjectDump } from '../../_components/ObjectDump'

export const MissingRegions = ({ regions }: { regions: TRegion[] }) => {
  const existingRegionSlugs = regions.map((region) => region.slug)
  const missingRegions = staticRegion.filter((region) => !existingRegionSlugs.includes(region.slug))

  return (
    <>
      <h2>Fehlende Regionen</h2>
      <p>Regionen die in der DB fehlen aber in unserer statischen Datei vorliegen.</p>
      <table className="overflow-clip rounded bg-white/50">
        <thead>
          <tr className="bg-white/90">
            <th>Name</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {missingRegions.map((region) => (
            <tr key={region.slug}>
              <th>
                <strong>{region.name}</strong>
              </th>
              <td>
                <ObjectDump data={region} />
              </td>
              <td>
                <Link href={`/admin/regions/new?slug=${region.slug}`}>Anlegen</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

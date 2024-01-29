'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter } from 'next/navigation'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import { Pill } from 'src/app/_components/text/Pill'
import deleteRegion from 'src/regions/mutations/deleteRegion'
import { TRegion } from 'src/regions/queries/getRegion'
import { ObjectDump } from '../../_components/ObjectDump'

export const RegionsTable = ({ regions }: { regions: TRegion[] }) => {
  const router = useRouter()
  const [deleteRegionMutation] = useMutation(deleteRegion)

  return (
    <table className="overflow-clip rounded bg-white/50">
      <thead>
        <tr className="bg-white/90">
          <th>Name</th>
          <th>Sichtbarkeit</th>
          <th>Export</th>
          <th>Atlas</th>
          <th>Rohdaten</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {regions.map((region) => {
          return (
            <tr key={region.slug}>
              <th>{region.name}</th>
              <td>
                {region.public ? (
                  <Pill color="green">Öffentlich</Pill>
                ) : (
                  <Pill color="purple">Versteckt</Pill>
                )}
              </td>
              <td>
                {region.exportPublic ? (
                  <Pill color="red">Jeder</Pill>
                ) : (
                  <Pill color="green">Mitglieder</Pill>
                )}
              </td>
              <td>
                <Link href={`/regionen/${region.slug}`}>Öffnen…</Link>
              </td>
              <td>
                <ObjectDump data={region} />
              </td>
              <td>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`»${region.slug}« wirklich unwiderruflich löschen?`)) {
                      try {
                        await deleteRegionMutation({ slug: region.slug })
                        router.push('/admin/regions')
                      } catch (error: any) {
                        window.alert(error.toString())
                        console.error(error)
                      }
                    }
                  }}
                  className={linkStyles}
                >
                  Löschen
                </button>
              </td>
              <td>
                <Link href={`/admin/regions/${region.slug}/edit`}>Bearbeiten</Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

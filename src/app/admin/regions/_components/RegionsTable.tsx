'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter } from 'next/navigation'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
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
          <th>Details</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {regions.map((region) => (
          <tr key={region.slug}>
            <th>
              <strong>{region.name}</strong>
            </th>
            <td>{region.public ? 'Öffentlich' : 'Versteckt'}</td>
            <td>
              <ObjectDump data={region} />
            </td>
            <td>
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm(`${region.name} wirklich unwiderruflich löschen?`)) {
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
        ))}
      </tbody>
    </table>
  )
}

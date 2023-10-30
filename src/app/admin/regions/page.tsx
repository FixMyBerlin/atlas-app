'use client'

import { useMutation, usePaginatedQuery } from '@blitzjs/rpc'
import { useRouter } from 'next/navigation'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import deleteRegion from 'src/regions/mutations/deleteRegion'
import getRegions from 'src/regions/queries/getRegions'

export default function AdminRegionsPage() {
  const router = useRouter()
  const [{ regions }] = usePaginatedQuery(getRegions, {})
  const [deleteRegionMutation] = useMutation(deleteRegion)

  return (
    <>
      <table className="overflow-clip rounded bg-white/50">
        <thead>
          <tr className="bg-white/90">
            <th>Name</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {regions.map((region) => (
            <tr key={region.slug}>
              <th>
                <strong>{region.fullName}</strong>
              </th>
              <td>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`${region.name} wirklich unwiderruflich löschen?`)) {
                      await deleteRegionMutation({ slug: region.slug })
                      await router.push('/admin/regions')
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

      <Link href="/admin/regions/new" button>
        Neue Region
      </Link>
    </>
  )
}

AdminRegionsPage.authenticate = true

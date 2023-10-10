import { Routes } from '@blitzjs/next'
import { useMutation, usePaginatedQuery } from '@blitzjs/rpc'
import { Metadata } from 'next'
import { useRouter } from 'next/router'
import { Link } from 'src/app/_components/links/Link'
import deleteRegion from 'src/regions/mutations/deleteRegion'
import getRegions from 'src/regions/queries/getRegions'

export const metadata: Metadata = {
  title: 'ADMIN Regionen',
}

export default function AdminRegionsPage() {
  const router = useRouter()
  const [{ regions }] = usePaginatedQuery(getRegions, {})
  const [deleteRegionMutation] = useMutation(deleteRegion)

  return (
    <>
      <ul>
        {regions.map((region) => (
          <li key={region.slug}>
            <strong>{region.fullName}</strong>
            <button
              type="button"
              onClick={async () => {
                if (window.confirm(`${region.name} wirklich unwiderruflich löschen?`)) {
                  await deleteRegionMutation({ slug: region.slug })
                  await router.push(Routes.AdminRegionsPage())
                }
              }}
            >
              Löschen
            </button>
            <Link href={Routes.AdminEditRegionPage({ regionSlug: region.slug })}>Bearbeiten</Link>
          </li>
        ))}
      </ul>

      <Link href={Routes.AdminNewRegionPage()} button>
        Neue Region
      </Link>
    </>
  )
}

AdminRegionsPage.authenticate = true

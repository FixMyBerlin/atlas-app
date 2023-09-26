import { Routes } from '@blitzjs/next'
import { useMutation, usePaginatedQuery } from '@blitzjs/rpc'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { Spinner } from 'src/core/components/Spinner/Spinner'
import { Link } from 'src/core/components/links'
import { Layout } from 'src/core/layouts/Layout'
import { PageRegionsRegionTeaser } from 'src/regions/components/PageRegions'
import deleteRegion from 'src/regions/mutations/deleteRegion'
import getRegions from 'src/regions/queries/getRegions'

export const AdminRegionsList = () => {
  const router = useRouter()
  const [{ regions }] = usePaginatedQuery(getRegions, {})
  const [deleteRegionMutation] = useMutation(deleteRegion)

  return (
    <>
      <ul>
        {regions.map((region) => (
          <li key={region.slug}>
            <PageRegionsRegionTeaser region={region} />
            <button
              type="button"
              onClick={async () => {
                if (window.confirm(`${region.name} wirklich unwiderruflich löschen?`)) {
                  await deleteRegionMutation({ id: region.id })
                  await router.push(Routes.AdminRegionsPage())
                }
              }}
            >
              Löschen
            </button>
            <Link href={Routes.EditRegionPage({ regionSlug: region.slug })}>Bearbeiten</Link>
          </li>
        ))}
      </ul>

      <Link href={Routes.NewRegionPage()} button>
        Neue Region
      </Link>
    </>
  )
}

const AdminRegionsPage = () => {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <AdminRegionsList />
      </Suspense>
    </Layout>
  )
}

AdminRegionsPage.authenticate = true
export default AdminRegionsPage

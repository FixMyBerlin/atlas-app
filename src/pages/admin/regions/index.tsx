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
      {regions.map((region) => (
        <div key={region.slug}>
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
        </div>
      ))}
    </>
  )
}

const AdminRegionsPage = () => {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <AdminRegionsList />
      </Suspense>
      <Link href={Routes.NewRegionPage()}>Create Region</Link>
    </Layout>
  )
}

AdminRegionsPage.authenticate = true
export default AdminRegionsPage

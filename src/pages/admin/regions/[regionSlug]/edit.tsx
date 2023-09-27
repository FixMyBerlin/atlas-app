import { Routes, useParam } from '@blitzjs/next'
import { useMutation, useQuery } from '@blitzjs/rpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { Spinner } from 'src/core/components/Spinner/Spinner'
import { Layout } from 'src/core/layouts/Layout'
import { FORM_ERROR, RegionForm } from 'src/regions/components/RegionForm'
import updateRegion from 'src/regions/mutations/updateRegion'
import getRegion from 'src/regions/queries/getPublicRegion'
import { UpdateRegionSchema } from 'src/regions/schemas'

export const AdminEditRegion = () => {
  const router = useRouter()
  const regionSlug = useParam('regionSlug', 'string')
  const [region, { setQueryData }] = useQuery(
    getRegion,
    { slug: regionSlug },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    },
  )
  const [updateRegionMutation] = useMutation(updateRegion)

  return (
    <>
      <h1>Edit Region {region.id}</h1>
      <pre>{JSON.stringify(region, null, 2)}</pre>
      <Suspense fallback={<Spinner />}>
        <RegionForm
          submitText="Update Region"
          schema={UpdateRegionSchema}
          initialValues={region}
          onSubmit={async (values) => {
            try {
              const updated = await updateRegionMutation({
                ...values,
                id: region.id,
              })
              await setQueryData(updated)
              await router.push(Routes.ShowRegionPage({ regionSlug: updated.slug }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Suspense>
    </>
  )
}

const AdminEditRegionPage = () => {
  return (
    <Layout>
      <Suspense fallback={<Spinner page />}>
        <AdminEditRegion />
      </Suspense>

      <p>
        <Link href={Routes.RegionsPage()}>Regionen</Link>
      </p>
    </Layout>
  )
}

AdminEditRegionPage.authenticate = true
export default AdminEditRegionPage

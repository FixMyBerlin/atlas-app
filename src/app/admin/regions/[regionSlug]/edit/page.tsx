'use client'

import { useMutation, useQuery } from '@blitzjs/rpc'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { FORM_ERROR, RegionForm } from 'src/app/regionen/_components/regions/RegionForm'
import updateRegion from 'src/regions/mutations/updateRegion'
import getPublicRegion from 'src/regions/queries/getPublicRegion'
import { UpdateRegionSchema } from 'src/regions/schemas'

export default function AdminEditRegionPage() {
  const router = useRouter()
  const regionSlug = useRegionSlug()
  const [region, { setQueryData }] = useQuery(
    getPublicRegion,
    { slug: regionSlug },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    },
  )
  const [updateRegionMutation] = useMutation(updateRegion)

  return (
    <>
      <h1>Edit Region {region.slug}</h1>
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
                slug: region.slug,
              })
              await setQueryData(updated)
              await router.push(`/regionen/${updated.slug}`)
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Suspense>
      <p>
        <Link href="/regionen">Regionen</Link>
      </p>
    </>
  )
}

AdminEditRegionPage.authenticate = true

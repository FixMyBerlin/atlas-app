'use client'

import { useMutation } from '@blitzjs/rpc'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import {
  FORM_ERROR,
  RegionForm,
} from 'src/app/admin/regions/[regionSlug]/edit/_components/RegionForm'
import createRegion from 'src/regions/mutations/createRegion'
import { CreateRegionSchema } from 'src/regions/schemas'

export default function AdminNewRegionPage() {
  const router = useRouter()
  const [createRegionMutation] = useMutation(createRegion)

  return (
    <>
      <h1>Create New Region</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RegionForm
          submitText="Create Region"
          schema={CreateRegionSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const region = await createRegionMutation(values)
              await router.push(`/regionen/${region.slug}`)
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
        <Link href="/regionen">Regions</Link>
      </p>
    </>
  )
}

AdminNewRegionPage.authenticate = true

'use client'

import { useMutation } from '@blitzjs/rpc'
import { Metadata } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { FORM_ERROR, RegionForm } from 'src/app/regionen/_components/regions/RegionForm'
import createRegion from 'src/regions/mutations/createRegion'
import { CreateRegionSchema } from 'src/regions/schemas'

export const metadata: Metadata = {
  title: 'ADMIN neue Region',
}

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

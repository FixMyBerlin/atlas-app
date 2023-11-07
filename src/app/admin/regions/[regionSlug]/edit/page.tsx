'use client'

import { useMutation, useQuery } from '@blitzjs/rpc'
import clsx from 'clsx'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import { frenchQuote } from 'src/app/_components/text/Quotes'
import { Breadcrumb } from 'src/app/admin/_components/Breadcrumb'
import {
  FORM_ERROR,
  RegionForm,
} from 'src/app/admin/regions/[regionSlug]/edit/_components/RegionForm'
import updateRegion from 'src/regions/mutations/updateRegion'
import getPublicRegion from 'src/regions/queries/getPublicRegion'
import { UpdateRegionSchema } from 'src/regions/schemas'

export default function AdminEditRegionPage() {
  const router = useRouter()
  const regionSlug = useRegionSlug()!
  const [region] = useQuery(
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
      <Breadcrumb
        pages={[
          { href: '/admin/regions', name: 'Regionen' },
          // TS: No idea why this "as" is needed. `regionSlug` is a simple string so it should work.
          { href: `/admin/regions/${regionSlug}/edit` as Route, name: 'Anlegen' },
        ]}
      />

      <details className="prose-sm my-10">
        <summary className={clsx(linkStyles, 'cursor-pointer')}>JSON Dump</summary>
        <pre>{JSON.stringify(region, null, 2)}</pre>
      </details>

      <Suspense fallback={<Spinner />}>
        <RegionForm
          submitText="Update Region"
          schema={UpdateRegionSchema}
          initialValues={region}
          onSubmit={async (values) => {
            try {
              await updateRegionMutation({
                ...values,
                slug: region.slug,
              })
              router.push('/admin/regions')
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

AdminEditRegionPage.authenticate = true

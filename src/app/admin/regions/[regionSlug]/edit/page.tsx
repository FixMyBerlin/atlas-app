'use client'

import { useMutation, useQuery } from '@blitzjs/rpc'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { Breadcrumb } from 'src/app/admin/_components/Breadcrumb'
import { HeaderWrapper } from 'src/app/admin/_components/HeaderWrapper'
import { ObjectDump } from 'src/app/admin/_components/ObjectDump'
import { FORM_ERROR, RegionForm } from 'src/app/admin/regions/_components/RegionForm'
import updateRegion from 'src/regions/mutations/updateRegion'
import getRegion from 'src/regions/queries/getRegion'
import { RegionFormSchema } from 'src/regions/schemas'

export default function AdminEditRegionPage() {
  const router = useRouter()
  const regionSlug = useRegionSlug()!
  const [region] = useQuery(
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
      <HeaderWrapper>
        <Breadcrumb
          pages={[
            { href: '/admin/regions', name: 'Regionen' },
            // TS: No idea why this "as" is needed. `regionSlug` is a simple string so it should work.
            { href: `/admin/regions/${regionSlug}/edit` as Route, name: 'Anlegen' },
          ]}
        />
      </HeaderWrapper>

      <ObjectDump data={region} className="my-10" />

      <RegionForm
        submitText="Update Region"
        schema={RegionFormSchema}
        initialValues={{ ...region, ...{ public: String(region.public) } }}
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
    </>
  )
}

AdminEditRegionPage.authenticate = { role: 'ADMIN' }

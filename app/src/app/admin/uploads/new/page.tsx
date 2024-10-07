'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter, useSearchParams } from 'next/navigation'
import { FORM_ERROR, RegionForm } from 'src/app/admin/regions/_components/RegionForm'
import createRegion from 'src/regions/mutations/createRegion'
import { RegionFormSchema } from 'src/regions/schemas'
import { Breadcrumb } from '../../_components/Breadcrumb'
import { HeaderWrapper } from '../../_components/HeaderWrapper'

export default function AdminUploadsNewPage() {
  const router = useRouter()
  const searchParamSlug = useSearchParams()?.get('slug') || undefined
  const [createRegionMutation] = useMutation(createRegion)

  return (
    <>
      <HeaderWrapper>
        <Breadcrumb
          pages={[
            { href: '/admin/regions', name: 'Regionen' },
            { href: '/admin/regions/new', name: 'Anlegen' },
          ]}
        />
      </HeaderWrapper>

      <RegionForm
        submitText="Region anlegen"
        schema={RegionFormSchema}
        initialValues={{
          slug: searchParamSlug,
          // @ts-expect-error the Form (and RegionFormSchema) require a string
          public: 'false',
          // @ts-expect-error
          exportPublic: 'false',
        }}
        onSubmit={async (values) => {
          try {
            await createRegionMutation(values)
            router.refresh()
            router.push(`/admin/regions`)
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

AdminUploadsNewPage.authenticate = true

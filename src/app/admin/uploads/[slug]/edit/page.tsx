'use client'

import { useMutation, useQuery } from '@blitzjs/rpc'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useSlug } from 'src/app/_hooks/useSlug'
import { Breadcrumb } from 'src/app/admin/_components/Breadcrumb'
import { HeaderWrapper } from 'src/app/admin/_components/HeaderWrapper'
import { ObjectDump } from 'src/app/admin/_components/ObjectDump'
import { FORM_ERROR, UploadForm } from 'src/app/admin/uploads/_components/UploadForm'
import updateUpload from 'src/uploads/mutations/updateUpload'
import getUploadWithRegions from 'src/uploads/queries/getUploadWithRegions'
import { UploadFormSchema } from 'src/uploads/schema'

export default function AdminEditUploadPage() {
  const router = useRouter()
  const slug = useSlug()

  const [upload] = useQuery(getUploadWithRegions, { slug: slug! }, { staleTime: Infinity })!
  const [updateUploadMutation] = useMutation(updateUpload)

  return (
    <>
      <HeaderWrapper>
        <Breadcrumb
          pages={[
            { href: '/admin/uploads', name: 'Uploads' },
            { href: `/admin/uploads/${slug}/edit` as Route, name: 'Bearbeiten' },
          ]}
        />
      </HeaderWrapper>

      <h1>{upload.slug}</h1>
      <p>
        <code>{upload.pmtilesUrl}</code>
      </p>

      <ObjectDump data={upload!} className="my-10" />

      <UploadForm
        submitText="Speichern"
        schema={UploadFormSchema}
        initialValues={{
          ...upload,
          // @ts-expect-error because data from form is transformed
          regions: upload.regions.map((region) => String(region.id)),
          public: JSON.stringify(upload.public),
        }}
        onSubmit={async (values) => {
          console.log(JSON.stringify(values, null, 2))
          try {
            // @ts-expect-error TODO: fix this
            await updateUploadMutation({
              id: upload.id,
              ...values,
            })
            router.refresh()
            // router.push('/admin/uploads')
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

AdminEditUploadPage.authenticate = { role: 'ADMIN' }

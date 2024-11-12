import { invoke } from '@/src/blitz-server'
import getUploads from '@/src/uploads/queries/getUploads'
import { Metadata } from 'next'
import { Breadcrumb } from '../_components/Breadcrumb'
import { HeaderWrapper } from '../_components/HeaderWrapper'
import { UploadsTable } from './_components/UploadTable'

export const metadata: Metadata = {
  title: 'Uploads',
}

export default async function AdminRegionsPage() {
  const { uploads } = await invoke(getUploads, {})

  return (
    <>
      <HeaderWrapper>
        <Breadcrumb pages={[{ href: '/admin/uploads', name: 'Uploads' }]} />
      </HeaderWrapper>

      <UploadsTable uploads={uploads} />
    </>
  )
}

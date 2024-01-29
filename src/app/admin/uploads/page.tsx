import { invoke } from '@blitzjs/rpc'
import { Metadata } from 'next'
import getUploads from 'src/uploads/queries/getUploads'
import { Breadcrumb } from '../_components/Breadcrumb'
import { HeaderWrapper } from '../_components/HeaderWrapper'
import { UploadTable } from './_components/UploadTable'

export const metadata: Metadata = {
  title: 'Uploads',
}

export default async function AdminRegionsPage() {
  const { uploads } = await invoke(getUploads, {})
  const tableFields = [
    { fieldName: 'slug', label: 'Datei Slug' },
    { fieldName: 'externalUrl', label: 'Private URL' },
    { fieldName: 'public', label: 'Öffentlich/Privat' },
    { fieldName: 'regions', label: 'Regionen' },
  ]

  return (
    <>
      <HeaderWrapper>
        <Breadcrumb pages={[{ href: '/admin/uploads', name: 'Uploads' }]} />
      </HeaderWrapper>

      <UploadTable records={uploads} fields={tableFields} />
    </>
  )
}
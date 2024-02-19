'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { MetaData } from 'scripts/StaticDatasets/types'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import { Pill } from 'src/app/_components/text/Pill'
import deleteUpload from 'src/uploads/mutations/deleteUpload'
import { TUpload } from 'src/uploads/queries/getUploads'
import { AdminTable } from '../../_components/AdminTable'
import { ObjectDump } from '../../_components/ObjectDump'

export const UploadsTable = ({ uploads }: { uploads: TUpload[] }) => {
  const router = useRouter()
  const [deleteUploadMutation] = useMutation(deleteUpload)

  return (
    <AdminTable header={['Slug', 'Zugriff', 'Regionen', 'Ansichten', '', '']}>
      {uploads.map((upload) => {
        return (
          <tr key={upload.id}>
            <td>
              <strong>{upload.slug}</strong>
            </td>
            <td>
              {upload.public ? (
                <Pill color="purple">Public</Pill>
              ) : (
                <Pill color="green">Login</Pill>
              )}
            </td>
            <td>
              <ul className="marker:text-gray-800">
                {upload.regions.map((region) => (
                  <li key={region.slug}>{region.slug}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul className="marker:text-gray-800">
                {Array.isArray(upload.configs) &&
                  upload.configs?.map((config) => {
                    const { name, category } = config as any as MetaData['configs'][number]
                    return (
                      <li key={name}>
                        {name} — Category: {category || '-'}
                      </li>
                    )
                  })}
              </ul>
            </td>
            <td>
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm(`»${upload.slug}« wirklich unwiderruflich löschen?`)) {
                    try {
                      await deleteUploadMutation({ id: upload.id })
                      router.refresh()
                    } catch (error: any) {
                      window.alert(error.toString())
                      console.error(error)
                    }
                  }
                }}
                className={linkStyles}
              >
                Löschen
              </button>
            </td>
            <td>
              <Link href={`/admin/uploads/${upload.slug}`}>Details</Link>
            </td>
          </tr>
        )
      })}
    </AdminTable>
  )
}

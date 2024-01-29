'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter } from 'next/navigation'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import { Pill } from 'src/app/_components/text/Pill'
import deleteUpload from 'src/uploads/mutations/deleteUpload'
import { TUpload } from 'src/uploads/queries/getUploads'
import { ObjectDump } from '../../_components/ObjectDump'

export const UploadsTable = ({ uploads }: { uploads: TUpload[] }) => {
  const router = useRouter()
  const [deleteUploadMutation] = useMutation(deleteUpload)

  return (
    <table className="overflow-clip rounded bg-white/50">
      <thead>
        <tr className="bg-white/90">
          <th>Slug</th>
          <th>Interne Url</th>
          <th>Zugriff</th>
          <th>Regionen</th>
          <th>Rohdaten</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {uploads.map((upload) => {
          return (
            <tr key={upload.id}>
              <th>{upload.slug}</th>
              <td className="text-[10px]">{upload.externalUrl}</td>
              <td>
                {upload.public ? (
                  <Pill color="purple">Öffentlich</Pill>
                ) : (
                  <Pill color="green">Rechteinhaber:innen</Pill>
                )}
              </td>
              <td>
                <ul>
                  {upload.regions.map((region) => (
                    <li key={region.slug}>{region.slug}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ObjectDump data={upload} />
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
                <Link href={`/admin/uploads/${upload.slug}/edit`}>Bearbeiten</Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

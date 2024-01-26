'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter } from 'next/navigation'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import deleteRecord from 'src/uploads/mutations/deleteUpload'
import { ObjectDump } from '../../_components/ObjectDump'

type Props = {
  records: Record<string, any>[]
  fields: { fieldName: string; label?: string }[]
}

const DeleteButton = ({ record }) => {
  const router = useRouter()
  const [deleteRecordMutation] = useMutation(deleteRecord)

  return (
    <button
      type="button"
      onClick={async () => {
        if (window.confirm(`${record.slug} wirklich unwiderruflich löschen?`)) {
          try {
            await deleteRecordMutation({ id: record.id })
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
  )
}

const EditButton = ({ record }) => (
  <Link href={`/admin/uploads/${record.slug}/edit`}>Bearbeiten</Link>
)

const formatValue = (v) => {
  if (typeof v === 'boolean') {
    return v ? '🗹' : '☐'
  } else {
    return String(v)
  }
}

export const UploadTable = ({ records, fields }: Props) => {
  return (
    <table className="overflow-clip rounded bg-white/50">
      <thead>
        <tr className="bg-white/90">
          <th>ID</th>
          <>
            {fields.map(({ fieldName, label }) => (
              <th key={fieldName}>{label || fieldName}</th>
            ))}
          </>
          <th />
          {/* dump */}
          <th />
          {/* delete */}
          <th />
          {/* edit */}
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td>{record.id}</td>
            <>
              {fields.map(({ fieldName }) => (
                <td key={fieldName}>{formatValue(record[fieldName])}</td>
              ))}
            </>
            <td>
              <ObjectDump data={record} />
            </td>
            <td>
              <DeleteButton record={record} />
            </td>
            <td>
              <EditButton record={record} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

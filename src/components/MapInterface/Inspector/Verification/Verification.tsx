import { Link } from '@components/Link'
import { getSourceData } from '@components/MapInterface/mapData'
import React from 'react'
import { extractSourceIdIdFromSourceKey } from '../utils'

type Props = {
  visible: boolean
  sourceKey: string
}

export const Verification: React.FC<Props> = ({ visible, sourceKey }) => {
  if (!visible) return null

  const sourceData = getSourceData(
    extractSourceIdIdFromSourceKey(sourceKey.toString())
  )
  console.log(
    'We might want to put the API routes on the source object and use this here?',
    sourceData
  )

  return (
    <div className="border-t bg-gray-50 px-4 py-3">
      <h4 className="mb-2 font-semibold text-gray-800">Daten bestätigen:</h4>
      <div className="space-x-2">
        <Link to="#todo" button className="bg-white hover:bg-green-200/80">
          Daten richtig
        </Link>
        <Link to="#todo" button className="bg-white hover:bg-orange-200/80">
          Überarbeitung nötig
        </Link>
      </div>
    </div>
  )
}

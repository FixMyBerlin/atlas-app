import { Link } from '@components/Link'
import React from 'react'
import { historyUrl, osmUrl } from './osmUrls'

type Props = { properties: { [key: string]: any } }

export const Links: React.FC<Props> = ({ properties }) => {
  const osmUrl_ = osmUrl(properties.osm_type, properties.osm_id)
  const historyUrl_ = historyUrl(properties.osm_type, properties.osm_id)

  if (!osmUrl_ || !historyUrl_) return null
  return (
    <div className="border-t bg-white px-4 py-2.5 text-xs">
      <details className="[&_summary]:open:mb-1 [&_summary]:open:font-semibold">
        <summary className="cursor-pointer">Tools</summary>
        <div className="space-y-2">
          <p>
            <Link external blank to={osmUrl_}>
              In OpenStreetMap öffnen
            </Link>
          </p>
          <p>
            <Link external blank to={historyUrl_}>
              Änderungshistorie anzeigen
            </Link>
          </p>
        </div>
      </details>
    </div>
  )
}

import { Link } from '@components/Link'
import React from 'react'

type Props = {
  properties: { [key: string]: any }
  documentedKeys: string[] | undefined
}

export const OtherProperties: React.FC<Props> = ({
  properties,
  documentedKeys,
}) => {
  const systemKeys = [
    '_freshNotes',
    '_skip',
    '_skipNotes',
    'fresh_age_days',
    'fresh',
    'is_present',
    'osm_id',
    'osm_type',
    'osm_url',
    'update_at',
    'verified_at',
    'verified',
    'version',
    'offset',
    'side',
  ]
  const otherOsmProperties = Object.entries(properties)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([key, _v]) => !systemKeys.includes(key))

  const systemProperties = Object.entries(properties)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(
      ([key, _v]) => systemKeys.includes(key) && !documentedKeys?.includes(key)
    )

  return (
    <details className="border-t bg-white px-4 py-2.5 text-xs [&_summary]:open:mb-1 [&_summary]:open:font-semibold">
      <summary className="cursor-pointer text-right">Weitere Werte</summary>
      <div className="grid grid-cols-2 gap-4 break-all">
        <div>
          <h5 className="mb-2 font-semibold">Weitere OSM Werte:</h5>
          {otherOsmProperties.length ? (
            otherOsmProperties.map(([key, value]) => {
              return (
                <p key={key} className="mb-0.5 border-b border-gray-200 pb-0.5">
                  <code>
                    {key}:{' '}
                    {typeof value === 'boolean' ? JSON.stringify(value) : value}{' '}
                    <Link
                      blank
                      to={`https://wiki.openstreetmap.org/wiki/Tag:${key}=${value}`}
                      title="OpenStreetMap Wiki"
                    >
                      W
                    </Link>
                  </code>
                </p>
              )
            })
          ) : (
            <p>./.</p>
          )}
        </div>
        <div>
          <h5 className="mb-2 font-semibold">System-Werte:</h5>
          {systemProperties.length ? (
            systemProperties.map(([key, value]) => {
              return (
                <p key={key} className="mb-0.5 border-b border-gray-200 pb-0.5">
                  <code>
                    {key}:{' '}
                    {typeof value === 'boolean' ? JSON.stringify(value) : value}
                  </code>
                </p>
              )
            })
          ) : (
            <p>./.</p>
          )}
        </div>
      </div>
    </details>
  )
}

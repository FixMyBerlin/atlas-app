import React from 'react'
import { Link } from 'src/app/_components/links/Link'
import { Pill } from 'src/app/_components/text/Pill'
import { isProd } from 'src/app/_components/utils/isEnv'

type Props = {
  properties: { [key: string]: any }
  documentedKeys: string[] | undefined | false
}

export const ToolsOtherProperties: React.FC<Props> = ({ properties, documentedKeys }) => {
  const systemKeys = [
    '_freshNotes',
    '_skip',
    '_skipNotes',
    '_todos',
    'fresh_age_days',
    'fresh',
    'is_present',
    'osm_id',
    'osm_type',
    'osm_url',
    'update_at',
    'updated_age',
    'verified_at',
    'verified',
    'version',
    'offset',
    'side',
    'sign',
    'prefix',
    'id',
  ]
  const otherOsmProperties = Object.entries(properties)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([key, _v]) => !systemKeys.includes(key))

  const systemProperties = Object.entries(properties)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(
      ([key, _v]) => systemKeys.includes(key) && documentedKeys && !documentedKeys?.includes(key),
    )

  return (
    <details className="mt-3">
      <summary className="ml-1.5 cursor-pointer font-semibold text-gray-600">
        <span className="ml-1.5">Weitere Daten an diesem Element</span>
      </summary>
      <div className="mt-3 grid grid-cols-2 gap-4 break-all text-xs ">
        <div>
          <h5 className="mb-2 font-semibold">Inhaltliche Daten</h5>
          {otherOsmProperties.length ? (
            otherOsmProperties.map(([key, value]) => {
              return (
                <p key={key} className="mb-0.5 border-b border-gray-200 pb-0.5">
                  <code title={`${key}=${value}: ${value} is a ${typeof value}`}>
                    {key}: {typeof value === 'boolean' ? JSON.stringify(value) : value}{' '}
                    {key.startsWith('osm_') && (
                      <Link
                        blank
                        href={`https://wiki.openstreetmap.org/wiki/Tag:${key}=${value}`}
                        title="OpenStreetMap Wiki"
                        className="scale-75"
                      >
                        Wiki
                      </Link>
                    )}
                  </code>
                </p>
              )
            })
          ) : (
            <p>./.</p>
          )}
        </div>
        <div>
          <h5 className="mb-2 font-semibold">System-Daten:</h5>
          {systemProperties.length ? (
            systemProperties.map(([key, value]) => {
              return (
                <p key={key} className="mb-0.5 border-b border-gray-200 pb-0.5">
                  <code title={`${value} is a ${typeof value}`}>
                    {key}: {typeof value === 'boolean' ? JSON.stringify(value) : value}{' '}
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

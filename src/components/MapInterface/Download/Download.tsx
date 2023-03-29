import { Link } from '@components/Link'
import { IconModal } from '@components/Modal'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { getApiUrl, getTilesUrl } from '@components/utils'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { LocationGenerics } from '@routes/routes'
import { regionFromPath } from '@routes/utils'
import { useMatch, useSearch } from '@tanstack/react-location'
import { useQuery } from '@tanstack/react-query'
import { getSourceData, getTopicData } from '../mapData'
import { flattenConfigTopics } from '../mapStateConfig/utils/flattenConfigTopics'

export const Download: React.FC = () => {
  const { config: configThemesTopics } = useSearch<LocationGenerics>()

  // Get the bbox from our region data
  const {
    params: { regionPath },
  } = useMatch()
  const region = regionFromPath(regionPath)
  const bbox = region?.bbox ? region.bbox : { min: [0, 0], max: [0, 0] }
  const allowDownload = region?.bbox ? true : false

  const osmDataDate = useQuery({
    queryKey: ['metadata'],
    queryFn: async () => {
      const response = await fetch(`${getTilesUrl()}/public.metadata.json`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  if (!configThemesTopics) return null
  const flatConfigTopics = flattenConfigTopics(configThemesTopics)

  return (
    <section>
      <IconModal
        title="Daten des Radverkehrsatlas downloaden"
        titleIcon="download"
        triggerStyle="button"
        triggerIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
      >
        <p className="pt-5 pb-2.5 text-sm">
          Alle Daten stehen als <strong>GeoJSON</strong> zum Download sowie als{' '}
          <strong>Vector Tiles</strong> zur Darstellung zur Verfügung.
        </p>

        {!allowDownload && (
          <p className="mb-2.5 rounded bg-orange-100 p-2 text-sm">
            Hinweis: GeoJSON Export ist für die Region {region?.fullName} nicht eingerichtet.
          </p>
        )}

        <p className="flex items-center gap-2 pb-5 text-sm">
          Letzte Aktualisierung:{' '}
          {!!osmDataDate.data?.description && (
            <span>
              {new Date(
                Date.parse(JSON.parse(osmDataDate.data?.description)?.osm_data_from)
              ).toLocaleDateString('de-DE')}
            </span>
          )}
          {!!osmDataDate.isLoading && <SmallSpinner />}
          {!!osmDataDate.error && (
            <span className="text-orange-500">Fehler beim Laden des Datums</span>
          )}
        </p>

        <ul className="mb-2 divide-y divide-gray-200 border-y border-gray-200">
          {flatConfigTopics.map((flatTopicConfig) => {
            const topicData = getTopicData(flatTopicConfig.id)
            const sourceData = getSourceData(topicData?.sourceId)

            // Download needs to be enabled per source
            if (!sourceData.export.enabled) {
              return null
            }

            return (
              <li key={topicData.id} className="py-5">
                <h3 className="mb-1 text-sm font-bold text-purple-800">{topicData.name}:</h3>

                <p className="mb-2 text-sm text-gray-500">
                  {topicData.desc}
                  {!!sourceData.attributionHtml && sourceData.attributionHtml !== 'todo' && (
                    <>
                      {!!topicData.desc && <br />}
                      <strong className="font-semibold">Attribution: </strong>
                      »
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sourceData.attributionHtml,
                        }}
                      />
                      «
                    </>
                  )}
                  {!!sourceData.licence && (
                    <>
                      {(!!sourceData.attributionHtml || !!topicData.desc) && <br />}
                      <strong className="font-semibold">Lizenz: </strong>
                      {sourceData.licence}
                    </>
                  )}
                </p>

                <div className="flex gap-2">
                  {allowDownload && (
                    <Link
                      to={`${getApiUrl()}/export/${sourceData.export.apiIdentifier}?minlon=${
                        bbox.min[0]
                      }&minlat=${bbox.min[1]}&maxlon=${bbox.max[0]}&maxlat=${bbox.max[1]}`}
                      classNameOverwrite="w-30 flex-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-1 focus:ring-yellow-500 hover:bg-yellow-50 bg-gray-50"
                      download
                      blank
                    >
                      <strong className="mb-0.5 block text-xs font-medium text-gray-900">
                        Download:
                      </strong>
                      <span className="block w-full border-0 p-0 font-mono text-gray-500 placeholder-gray-500 focus:ring-0 sm:text-sm">
                        GeoJSON
                      </span>
                    </Link>
                  )}

                  <div className="grow rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
                    <label
                      htmlFor={topicData.id}
                      className="mb-0.5 block text-xs font-medium text-gray-900"
                    >
                      Vector Tile URL:
                    </label>
                    <input
                      type="text"
                      name={topicData.id}
                      id={topicData.id}
                      className="block w-full border-0 p-0 font-mono text-gray-500 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="Vector Tile URL"
                      value={sourceData.tiles}
                      onFocus={(event: React.ChangeEvent<HTMLInputElement>) =>
                        event.target.select()
                      }
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </IconModal>
    </section>
  )
}

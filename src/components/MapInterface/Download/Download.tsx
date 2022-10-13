import { Link } from '@components/Link'
import { IconModal } from '@components/Modal'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { LocationGenerics } from '@routes/routes'
import { regionFromPath } from '@routes/utils'
import { useMatch, useSearch } from '@tanstack/react-location'
import { getSourceData, getTopicData } from '../mapData'
import { flatConfigTopics } from '../mapStateConfig/utils/flatConfigTopics'

export const Download: React.FC = () => {
  const { config: configThemesTopics } = useSearch<LocationGenerics>()
  if (!configThemesTopics) return null
  const flatTopics = flatConfigTopics(configThemesTopics)

  // Get the bbox from our region data
  const {
    params: { regionPath },
  } = useMatch()
  const region = regionFromPath(regionPath)
  const bbox = region ? region.bbox : []

  return (
    <div className="absolute bottom-14 left-5">
      <IconModal
        title="Daten des Radverkehrsatlas' downloaden"
        titleIcon="download"
        triggerStyle="button"
        triggerIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
      >
        <p className="pt-5 pb-2.5 text-sm">
          Alle Daten können als <strong>GeoJSON</strong> zum Download sowie als{' '}
          <strong>Vector Tiles</strong> zur Darstellung zur Verfügung.
        </p>

        {/* TODO: Die Description von https://tiles.radverkehrsatlas.de/public.metadata.json auslesen. */}
        <p className="pb-5 text-sm">Letzte Aktualisierung: ___</p>

        <ul className="mb-2 divide-y divide-gray-200 border-y border-gray-200">
          {flatTopics.map((topicConfig) => {
            const topicData = getTopicData(topicConfig.id)
            const sourceData = getSourceData(topicData?.sourceId)
            if (!topicData || !sourceData) return null

            return (
              <li key={topicData.id} className="py-5">
                <h3 className="mb-1 text-sm font-semibold text-purple-800">
                  {topicData.name}:
                </h3>

                <p className="mb-2 text-sm text-gray-500 line-clamp-2">
                  {topicData.desc}
                  {!!sourceData.attributionHtml &&
                    sourceData.attributionHtml !== 'todo' && (
                      <>
                        {!!topicData.desc && <br />}
                        <strong className="font-semibold">Attribution: </strong>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sourceData.attributionHtml,
                          }}
                        />
                      </>
                    )}
                </p>

                <div className="flex gap-2">
                  {/* TODO: Add propper download URL */}
                  {/* TODO: Reminder, the bbox params are fake ATM */}
                  <Link
                    to={`/#todo-download-url?regionBbox=${bbox
                      .flat()
                      .join(',')}`}
                    classNameOverwrite="w-30 flex-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-1 focus:ring-yellow-500 hover:bg-yellow-50 bg-stone-50"
                  >
                    <strong className="mb-0.5 block text-xs font-medium text-gray-900">
                      Download:
                    </strong>
                    <span className="block w-full border-0 p-0 font-mono text-gray-500 placeholder-gray-500 focus:ring-0 sm:text-sm">
                      GeoJSON
                    </span>
                  </Link>

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
    </div>
  )
}

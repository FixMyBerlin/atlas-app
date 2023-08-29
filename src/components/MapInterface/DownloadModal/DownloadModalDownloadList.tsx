import { Link } from '@components/Link'
import { LocationGenerics } from '@routes/routes'
import { useMatch, useSearch } from '@tanstack/react-location'
import { getSourceData, getTopicData } from '../mapData'
import { flattenConfigTopics } from '../mapStateConfig/utils/flattenConfigTopics'
import { exportApiUrlBbox } from './exportApiUrl'

type Props = { visible: boolean }

export const DownloadModalDownloadList: React.FC<Props> = ({ visible }) => {
  const { config: configThemesTopics } = useSearch<LocationGenerics>()

  // Get the bbox from our region data
  const {
    data: { region },
  } = useMatch<LocationGenerics>()
  const allowDownload = region?.bbox ? true : false

  if (!configThemesTopics || !visible) return null
  const flatConfigTopics = flattenConfigTopics(configThemesTopics)

  return (
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
              {allowDownload && region?.bbox && (
                <Link
                  to={exportApiUrlBbox(sourceData.export.apiIdentifier, region?.bbox)}
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
                  defaultValue={sourceData.tiles}
                  onFocus={(event: React.ChangeEvent<HTMLInputElement>) => event.target.select()}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

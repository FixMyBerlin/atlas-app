import { Link } from 'src/app/_components/links/Link'
import { exportApiUrlBbox } from './exportApiUrl'
import { sources } from '../mapData/sourcesMapData/sources.const'
import { useRegion } from 'src/app/(pages)/_components/regionUtils/useRegion'

type Props = { visible: boolean }

export const DownloadModalDownloadList: React.FC<Props> = ({ visible }) => {
  const exportEnabledSources = sources.filter((source) => source.export.enabled)

  // Get the bbox from our region data
  const { bbox } = useRegion()

  if (!visible) return null

  return (
    <ul className="mb-2 divide-y divide-gray-200 border-y border-gray-200">
      {exportEnabledSources.map((sourceData) => {
        if (!sourceData.export.apiIdentifier) return null

        return (
          <li key={sourceData.id} className="py-5">
            <h3 className="mb-1 text-sm font-bold text-purple-800">{sourceData.export.title}:</h3>

            <table className="my-2 text-sm text-gray-500">
              <tbody>
                <tr>
                  <th className="w-24 align-top text-xs font-medium text-gray-900">
                    Beschreibung:
                  </th>
                  <td className="pl-2">{sourceData.export.desc}</td>
                </tr>
                <tr>
                  <th className="w-24 align-top text-xs font-medium text-gray-900">Attribution:</th>
                  <td
                    className="pl-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        sourceData.attributionHtml !== 'todo' ? sourceData.attributionHtml : '',
                    }}
                  ></td>
                </tr>
                <tr>
                  <th className="w-24 align-top text-xs font-medium text-gray-900">Lizenz:</th>
                  <td className="pl-2">{sourceData.licence}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex gap-2">
              {bbox && (
                <Link
                  href={exportApiUrlBbox(sourceData.export.apiIdentifier, bbox)}
                  classNameOverwrite="w-24 flex-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-1 focus:ring-yellow-500 hover:bg-yellow-50 bg-gray-50"
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
                  htmlFor={sourceData.id}
                  className="mb-0.5 block text-xs font-medium text-gray-900"
                >
                  Vector Tile URL:
                </label>
                <input
                  type="text"
                  name={sourceData.id}
                  id={sourceData.id}
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

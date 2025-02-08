import { LinkExternal } from '@/src/app/_components/links/LinkExternal'
import { CompositTableRow } from './types'

export const tableKeyRadinfraDeStatistics = 'atlas_aggregated_lengths'
export const TagsTableRowCompositRadinfraDeStatistics = ({
  properties,
}: Pick<CompositTableRow, 'properties'>) => {
  const url = 'https://radinfra.de/statistik/'

  return (
    <div className="flex items-center justify-center p-10">
      <LinkExternal href={url} blank button>
        Statistik Details auf radinfra.de anzeigen
      </LinkExternal>
    </div>
  )
}

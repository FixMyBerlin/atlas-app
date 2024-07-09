import { CheckIcon, LinkIcon, LockClosedIcon } from '@heroicons/react/20/solid'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { isProd } from 'src/app/_components/utils/isEnv'
import { twJoin } from 'tailwind-merge'
import { useDataParam } from '../../../_hooks/useQueryState/useDataParam'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { createSourceKeyStaticDatasets } from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { iconFromLegend } from '../Legend/Legend'
import { LegendNameDesc } from '../Legend/LegendNameDesc'

export const SelectDataset = ({
  dataset,
}: {
  dataset: ReturnType<typeof useRegionDatasets>[number]
}) => {
  const {
    id,
    subId,
    name,
    updatedAt,
    description,
    dataSourceMarkdown,
    attributionHtml,
    licence,
    licenceOsmCompatible,
    legends,
    isPublic,
    githubUrl,
  } = dataset
  const key = createSourceKeyStaticDatasets(id, subId)
  const { dataParam, setDataParam } = useDataParam()
  const selected = dataParam.includes(key)

  const handleClick = () => {
    if (selected) {
      setDataParam(dataParam.filter((param) => param !== key))
    } else {
      setDataParam([...dataParam, key])
    }
  }

  return (
    <li key={key}>
      <button
        className={twJoin(
          'relative w-full cursor-pointer select-none py-2 pl-1.5 pr-2 text-left leading-tight text-gray-900',
          selected ? 'bg-yellow-400' : 'hover:bg-yellow-50',
        )}
        onClick={handleClick}
      >
        <div className="justify-left relative flex items-center gap-1">
          <CheckIcon
            className={twJoin('h-5 w-5 flex-none', selected ? 'text-yellow-900' : 'text-gray-100')}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-1 font-medium">
            <span>
              {name}
              {selected && updatedAt && <span className="text-gray-500"> {updatedAt}</span>}
            </span>
            {!isPublic && (
              <LockClosedIcon
                className="h-4 w-4 flex-none text-gray-400"
                title="Datensatz nur für angemeldete Nutzer:innen mit Rechten für die Region sichtbar."
              />
            )}
            {!isProd && githubUrl && (
              <LinkExternal
                blank
                href={githubUrl}
                className="absolute bottom-0 right-0 text-pink-500 hover:text-pink-800"
                title='Öffne den Datensatz im "atlas-static-data" Repository auf GitHub; Link nur in Dev und Staging sichtbar.'
              >
                <LinkIcon className="h-4 w-4" />
              </LinkExternal>
            )}
          </div>
        </div>
        {selected && description && (
          <p className={twJoin('mt-1', description?.includes('(!)') ? 'text-red-400' : '')}>
            {description}
          </p>
        )}
        {selected && dataSourceMarkdown && (
          // <Markdown markdown={dataSourceMarkdown} />
          <p className="text-xs leading-4">{dataSourceMarkdown}</p>
        )}
        {selected && attributionHtml && (
          <>
            <p
              className="mt-1 text-xs leading-4"
              dangerouslySetInnerHTML={{ __html: attributionHtml }}
            />
            {licence && (
              <p className="text-xs leading-4">
                Lizenz: {licence}
                {licenceOsmCompatible === 'licence' && ' (OSM-kompatibel)'}
                {licenceOsmCompatible === 'waiver' && ' (OSM kompatible Zusatzvereinbarung)'}
                {licenceOsmCompatible === 'no' && ' (nicht OSM kompatibel)'}
              </p>
            )}
          </>
        )}
        {selected && legends && Boolean(legends?.length) && (
          <ul>
            {legends.map((legend) => {
              return (
                <li
                  className="group relative mt-1 flex items-center font-normal leading-tight"
                  key={legend.id}
                >
                  <div className="h-5 w-5 flex-none">{iconFromLegend(legend)}</div>
                  <LegendNameDesc name={legend.name} desc={legend.desc} />
                </li>
              )
            })}
          </ul>
        )}
      </button>
    </li>
  )
}

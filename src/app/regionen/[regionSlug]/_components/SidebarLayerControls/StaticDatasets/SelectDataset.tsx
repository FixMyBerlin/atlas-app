import { Listbox } from '@headlessui/react'
import { CheckIcon, LinkIcon, LockClosedIcon } from '@heroicons/react/20/solid'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { isProd } from 'src/app/_components/utils/isEnv'
import { twJoin } from 'tailwind-merge'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { createSourceKeyStaticDatasets } from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { iconFromLegend } from '../Legend/Legend'
import { LegendNameDesc } from '../Legend/LegendNameDesc'

export const SelectDataset = ({
  dataset,
}: {
  dataset: ReturnType<typeof useRegionDatasets>[number]
}) => {
  const { id, subId, name, description, attributionHtml, legends, isPublic } = dataset
  const key = createSourceKeyStaticDatasets(id, subId)

  return (
    <Listbox.Option
      key={key}
      value={key}
      className={({ active, selected }) =>
        twJoin(
          'relative cursor-pointer select-none py-2 pl-1.5 pr-2 leading-tight text-gray-900',
          selected ? 'bg-yellow-400' : 'hover:bg-yellow-50',
        )
      }
    >
      {({ active, selected }) => (
        <>
          <div className="justify-left relative flex items-center gap-1">
            <CheckIcon
              className={twJoin(
                'h-5 w-5 flex-none',
                selected ? 'text-yellow-900' : 'text-gray-100',
              )}
              aria-hidden="true"
            />
            <div className="flex grow justify-between gap-1 font-medium">
              {name}
              {!isPublic && (
                <LockClosedIcon
                  className="h-4 w-4 text-gray-400"
                  title="Datensatz nur für angemeldete Nutzer:innen mit Rechten für die Region sichtbar."
                />
              )}
              {!isProd && (
                <LinkExternal
                  blank
                  href={`https://github.com/search?q=repo%3AFixMyBerlin%2Fatlas-static-data+path%3A${id}&type=code`}
                  className="absolute bottom-1 right-1 text-pink-500 hover:text-pink-800"
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
          {selected && attributionHtml && (
            <p
              className="mt-1 text-xs leading-4"
              dangerouslySetInnerHTML={{ __html: attributionHtml }}
            />
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
        </>
      )}
    </Listbox.Option>
  )
}

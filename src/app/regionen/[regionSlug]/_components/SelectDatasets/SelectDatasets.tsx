import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import React, { Fragment } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { useDataParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDataParam'
import { twJoin } from 'tailwind-merge'
import { useRegionDatasets } from '../../_hooks/useRegionDatasets/useRegionDatasets'
import { createSourceKeyStaticDatasets } from '../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { ListOption } from './ListOption'
import { iconFromLegend } from '../SidebarLayerControls/Legend/Legend'
import { LegendNameDesc } from '../SidebarLayerControls/Legend/LegendNameDesc'
import { LinkIcon, LockClosedIcon } from '@heroicons/react/20/solid'
import { isProd } from 'src/app/_components/utils/isEnv'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'

export const SelectDatasets: React.FC = () => {
  const { mainMap } = useMap()
  const { dataParam, setDataParam } = useDataParam()

  const onChange = (value: string[]) => {
    void setDataParam(value)
  }

  const regionDatasets = useRegionDatasets()

  if (!mainMap) return null
  if (!regionDatasets?.length) return null

  // The catgory can be null, which is our default Category.
  // The .category is also used as the named _for_now_ (in a cleaned up version).
  const groupedDatasets: { [category: string]: typeof regionDatasets } = {}
  regionDatasets.forEach((dataset) => {
    const category = (dataset.category as string) || 'Statische Daten'
    groupedDatasets[category] = [...(groupedDatasets[category] || []), dataset]
  })

  return (
    <div className="flex gap-1">
      {Object.entries(groupedDatasets).map(([category, datasets]) => {
        const categoryName = category.split('/').at(-1)
        return (
          <Listbox
            key={category}
            multiple
            as="section"
            className=""
            value={dataParam}
            onChange={onChange}
          >
            <div>
              <Listbox.Button className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                {categoryName}
                <ChevronUpDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Listbox.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options
                className={twJoin(
                  'absolute bottom-10 left-0 max-h-[calc(100%_-_2.5rem)] min-w-[15rem] max-w-[20rem] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                  // Style all the hover state of all a-tags inside this element; Helps understand the click target when `attributionHtml` has embedded external links.
                  '[&_a:hover]:underline',
                )}
              >
                {datasets.map(
                  ({ id, subId, name, description, attributionHtml, legends, isPublic }) => {
                    const key = createSourceKeyStaticDatasets(id, subId)
                    return (
                      <ListOption
                        key={key}
                        value={key}
                        name={
                          <>
                            <div className="flex justify-between gap-1">
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
                                  href={`https://github.com/FixMyBerlin/atlas-static-data/tree/main/geojson/${id}`}
                                  className="text-pink-500 hover:text-pink-800"
                                  title='Öffne den Datensatz im "atlas-static-data" Repository auf GitHub; Link nur in Dev und Staging sichtbar.'
                                >
                                  <LinkIcon className="h-4 w-4" />
                                </LinkExternal>
                              )}
                            </div>
                            {description && (
                              <span
                                className={twJoin(
                                  description?.includes('(!)') ? 'text-red-400' : 'text-gray-400',
                                  'block w-full overflow-visible',
                                )}
                              >
                                {description}
                              </span>
                            )}
                            {attributionHtml && (
                              <span
                                className="block text-xs leading-4 text-gray-400"
                                dangerouslySetInnerHTML={{ __html: attributionHtml }}
                              />
                            )}
                            {legends && Boolean(legends?.length) && (
                              <ul>
                                {legends.map((legend) => {
                                  return (
                                    <li
                                      className="group relative flex items-center"
                                      key={legend.id}
                                    >
                                      <div className="h-5 w-5 flex-none">
                                        {iconFromLegend(legend)}
                                      </div>
                                      <LegendNameDesc name={legend.name} desc={legend.desc} />
                                    </li>
                                  )
                                })}
                              </ul>
                            )}
                          </>
                        }
                      />
                    )
                  },
                )}
              </Listbox.Options>
            </Transition>
          </Listbox>
        )
      })}
    </div>
  )
}

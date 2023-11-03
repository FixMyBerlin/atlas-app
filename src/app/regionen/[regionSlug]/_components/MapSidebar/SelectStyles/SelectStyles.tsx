import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import produce from 'immer'
import React from 'react'
import { Portal } from 'src/app/_components/utils/usePopper/Portal'
import { usePopper } from 'src/app/_components/utils/usePopper/usePopper'
import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { MapDataThemeIds } from '../../mapData/themesMapData/themes.const'
import { MapDataTopic } from '../../mapData/types'
import { getStyleData, getTopicData } from '../../mapData/utils/getMapDataUtils'
import { TopicConfig } from '../../mapStateConfig/type'
import { createTopicStyleKey } from '../../utils/createKeyUtils/createKeyUtils'
import { SelectLegend } from '../SelectLegend/SelectLegend'

type Props = {
  themeId: MapDataThemeIds
  topicData: MapDataTopic
  topicConfig: TopicConfig
  disabled: boolean
}

export const SelectStyles: React.FC<Props> = ({ themeId, topicData, topicConfig, disabled }) => {
  const { configParam, setConfigParam } = useConfigParam()

  const [trigger, container] = usePopper({
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  })

  type ToggleActiveProps = { topicId: string; styleId: string }
  const toggleActive = ({ topicId, styleId }: ToggleActiveProps) => {
    const oldConfig = configParam
    const newConfig = produce(oldConfig, (draft) => {
      const topic = draft?.find((th) => th.id === themeId)?.topics.find((t) => t.id === topicId)

      if (topic) {
        const style = topic.styles.find((s) => s.id === styleId)
        topic.styles.forEach((s) => (s.active = false))
        style && (style.active = !style.active)
      }
    })
    void setConfigParam(newConfig)
  }

  if (!topicData || !topicConfig) return null

  const activeStyleConfig = topicConfig.styles.find((s) => s.active)
  const activeStyleData = getStyleData(topicData, activeStyleConfig?.id)

  return (
    <section className="mt-1.5">
      <Menu as="div" className="relative inline-block w-full text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button
                ref={trigger}
                disabled={disabled}
                // `w-*` has to be set fo the `truncate` to work
                className={clsx(
                  'inline-flex w-[12.5rem] justify-between rounded-md border border-gray-300  px-3 py-1.5 text-sm font-medium shadow-sm',
                  open ? 'shadow-md' : '',
                  disabled
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:shadow-md focus:outline-none',
                )}
              >
                <div className="flex gap-1 truncate">
                  <span className="truncate">{activeStyleData?.name}</span>
                </div>
                <ChevronDownIcon className="-mr-1 ml-0.5 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Portal>
              <Menu.Items
                ref={container}
                className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none"
              >
                <div className="py-1">
                  {topicConfig.styles.map((styleConfig) => {
                    const topicData = getTopicData(topicConfig.id)
                    const styleData = getStyleData(topicData, styleConfig.id)
                    if (!styleData) return null
                    const key = createTopicStyleKey(topicConfig.id, styleConfig.id)
                    return (
                      <Menu.Item key={key}>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() =>
                              toggleActive({
                                topicId: topicConfig.id,
                                styleId: styleConfig.id,
                              })
                            }
                            className={clsx(
                              styleConfig.active ? 'bg-yellow-400 text-gray-900' : 'text-gray-700',
                              { 'bg-yellow-50': active },
                              'block w-full px-4 py-2 text-left text-sm',
                            )}
                          >
                            {styleData.name}
                          </button>
                        )}
                      </Menu.Item>
                    )
                  })}
                </div>
              </Menu.Items>
            </Portal>
          </>
        )}
      </Menu>

      <SelectLegend topicId={topicConfig.id} styleData={activeStyleData} />
    </section>
  )
}

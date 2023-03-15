import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React, { useRef } from 'react'
import { getSourceData, getTopicData } from '../../mapData'
import { flatConfigTopics } from '../../mapStateConfig/utils/flatConfigTopics'
import { CalculatorControls } from './CalculatorControls'
import { CalculatorOutput } from './CalculatorOutput'

export const Calculator: React.FC = () => {
  const drawControlRef = useRef<MapboxDraw>()

  // This blob ist just to check if the Calculator should be enabled
  // by checking the sourceData.
  const { config: configThemesTopics } = useSearch<LocationGenerics>()
  if (!configThemesTopics) return null
  const activeTopicIds = flatConfigTopics(configThemesTopics)
    .filter((t) => t.active)
    .map((t) => t.id)
  const activeTopicsData = activeTopicIds.map((id) => getTopicData(id))
  const sourceDataOfActiveTopics = activeTopicsData.map((t) => getSourceData(t.sourceId))
  const calculatorSources = sourceDataOfActiveTopics.filter((s) => s.calculator.enabled)
  const calculatorSource = calculatorSources?.at(0)
  const queryLayers = calculatorSource?.calculator?.queryLayers
  if (calculatorSources.length > 1) {
    console.log(
      'ERROR: Calculator found multiple "calculator.enabled".',
      { count: calculatorSources.length },
      'Picking the first',
      { queryLayers }
    )
  }
  if (!queryLayers) return null

  return (
    <>
      <CalculatorControls queryLayers={queryLayers} drawControlRef={drawControlRef} />
      <CalculatorOutput keys={calculatorSource?.calculator?.keys} drawControlRef={drawControlRef} />
    </>
  )
}

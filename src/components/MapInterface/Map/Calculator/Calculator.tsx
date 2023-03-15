import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React, { useRef } from 'react'
import { getSourceData, getTopicData } from '../../mapData'
import { flatConfigTopics } from '../../mapStateConfig/utils/flatConfigTopics'
import { CalculatorControls } from './CalculatorControls'
import { CalculatorOutput } from './CalculatorOutput'

export const Calculator: React.FC = () => {
  // const drawRef = React.useRef<MapboxDraw>() // TODO

  const { config: configThemesTopics } = useSearch<LocationGenerics>()
  if (!configThemesTopics) return null

  const activeTopicIds = flatConfigTopics(configThemesTopics)
    .filter((t) => t.active)
    .map((t) => t.id)
  const activeTopicsData = activeTopicIds.map((id) => getTopicData(id))
  const sourceDataOfAtiveTopics = activeTopicsData.map((t) => getSourceData(t.sourceId))

  const calculatorSources = sourceDataOfAtiveTopics.filter((s) => s.calculator.enabled)
  const calculatorSource = calculatorSources?.at(0)
  const queryLayers = calculatorSource?.calculator?.queryLayers
  if (calculatorSources.length > 1) {
    console.log('ERROR: Calculator found multiple "calculator.enabled". Picking the first', {
      count: calculatorSources.length,
      queryLayers,
    })
  }

  const drawControlRef = useRef<MapboxDraw>()

  if (!queryLayers) return null

  return (
    <>
      <CalculatorControls queryLayers={queryLayers} drawControlRef={drawControlRef} />
      <CalculatorOutput keys={calculatorSource?.calculator?.keys} drawControlRef={drawControlRef} />
    </>
  )
}

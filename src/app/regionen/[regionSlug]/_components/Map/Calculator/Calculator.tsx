import React, { useRef } from 'react'
import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { getSourceData, getSubcategoryData } from '../../../_mapData/utils/getMapDataUtils'
import { flattenSubcategories } from '../../mapStateConfig/utils/flattenSubcategories'
import { CalculatorControls } from './CalculatorControls'
import { CalculatorOutput } from './CalculatorOutput'

export const Calculator: React.FC = () => {
  const drawControlRef = useRef<MapboxDraw>()

  // This blob ist just to check if the Calculator should be enabled
  // by checking the sourceData.
  const { configParam } = useConfigParam()
  if (!configParam) return null
  const activeSubcatIds = flattenSubcategories(configParam)
    // a subcategory is active, when any style is active that is not "hidden"
    .filter((t) => t.styles.filter((s) => s.id !== 'hidden').some((s) => s.active))
    .map((t) => t.id)
  const activeSubcatsData = activeSubcatIds.map((id) => getSubcategoryData(id))
  const sourceDataOfActiveSubcats = activeSubcatsData.map((t) => getSourceData(t.sourceId))
  const calculatorSources = sourceDataOfActiveSubcats.filter((s) => s.calculator.enabled)
  const calculatorSource = calculatorSources?.at(0)
  const queryLayers = calculatorSource?.calculator?.queryLayers
  if (calculatorSources.length > 1) {
    console.log(
      'ERROR: Calculator found multiple "calculator.enabled".',
      { count: calculatorSources.length },
      'Picking the first',
      { queryLayers },
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

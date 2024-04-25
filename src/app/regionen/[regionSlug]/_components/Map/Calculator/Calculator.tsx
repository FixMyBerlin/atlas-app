import React, { useRef } from 'react'
import { useCategoriesConfig } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { getSourceData } from '../../../_mapData/utils/getMapDataUtils'
import { CalculatorControls } from './CalculatorControls'
import { CalculatorOutput } from './CalculatorOutput'
import { flattenSubcategories } from './utils/flattenSubcategories'

export const Calculator: React.FC = () => {
  const drawControlRef = useRef<MapboxDraw>()

  // This blob ist just to check if the Calculator should be enabled
  // by checking the sourceData.
  const { categoriesConfig } = useCategoriesConfig()
  if (!categoriesConfig) return null
  const activeSubcategories = flattenSubcategories(categoriesConfig)
    // a subcategory is active, when any style is active that is not "hidden"
    .filter((t) => t.styles.filter((s) => s.id !== 'hidden').some((s) => s.active))
  const sourceDataOfActiveSubcats = activeSubcategories.map((t) => getSourceData(t.sourceId))
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

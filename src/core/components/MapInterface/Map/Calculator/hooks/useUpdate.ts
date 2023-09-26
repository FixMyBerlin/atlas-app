import { LocationGenerics } from 'src/TODO-MIRGRATE-REMOVE/routes'
import { useNavigate } from '@tanstack/react-location'
import { DrawArea } from '../CalculatorControlsDrawControl'
import { simplifyPositions } from '../utils/simplifyPositions'

export const useUpdate = () => {
  const navigate = useNavigate<LocationGenerics>()

  const updateDrawFeatures = (drawAreas: DrawArea[] | undefined, inputFeatures: DrawArea[]) => {
    const currFeatures = drawAreas || []
    // Input can be added, modified or multi select modification
    // Case new feature(s):
    const currFeatureIds = currFeatures.map((f) => f.id)
    const newFeatures = inputFeatures.filter((iF) => !currFeatureIds.includes(iF.id))
    // Case modified features
    const modifiedFeatures = inputFeatures.filter((iF) => currFeatureIds.includes(iF.id))
    // Rest: Non modified features
    const modifiedFeatureIds = modifiedFeatures.map((f) => f.id)
    const untouchedFeatures = currFeatures.filter((cF) => !modifiedFeatureIds.includes(cF.id))
    const newDrawAreas = [...newFeatures, ...modifiedFeatures, ...untouchedFeatures]
    const simplifiedDrawAreas = simplifyPositions(newDrawAreas)
    navigate({
      search: (old) => ({ ...old, draw: simplifiedDrawAreas }),
      replace: true,
    })
  }
  return { updateDrawFeatures }
}

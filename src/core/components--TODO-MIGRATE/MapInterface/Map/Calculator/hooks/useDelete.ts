import { LocationGenerics } from '@routes/routes'
import { useNavigate } from '@tanstack/react-location'
import { DrawArea } from '../CalculatorControlsDrawControl'

export const useDelete = () => {
  const navigate = useNavigate<LocationGenerics>()

  const deleteDrawFeatures = (
    drawAreas: DrawArea[] | undefined,
    features: DrawArea[] | undefined,
  ) => {
    if (!drawAreas || !features) return

    const currFeatures = drawAreas
    const inputFeatures = features
    const deletedFeaturesIds = inputFeatures.map((f) => f.id)
    const newDrawAreas = currFeatures.filter((feature) => !deletedFeaturesIds.includes(feature.id))
    navigate({
      search: (old) => ({ ...old, draw: newDrawAreas }),
      replace: true,
    })
  }

  return { deleteDrawFeatures }
}

import { useDrawParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDrawParam'
import { DrawArea } from '../CalculatorControlsDrawControl'

export const useDelete = () => {
  const { setDrawParam } = useDrawParam()

  const deleteDrawFeatures = (
    drawAreas: DrawArea[] | undefined,
    features: DrawArea[] | undefined,
  ) => {
    if (!drawAreas || !features) return

    const currFeatures = drawAreas
    const inputFeatures = features
    const deletedFeaturesIds = inputFeatures.map((f) => f.id)
    const newDrawAreas = currFeatures.filter((feature) => !deletedFeaturesIds.includes(feature.id))
    void setDrawParam(newDrawAreas)
  }

  return { deleteDrawFeatures }
}

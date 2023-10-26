import { DrawArea } from '../CalculatorControlsDrawControl'

// https://github.com/placemark/polyline/blob/main/lib/index.ts#L10-L14
function py2_round(value: number) {
  return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1)
}

const roundPosition = (position: GeoJSON.Position) => {
  const precision = 4
  const factor = Math.pow(10, precision)
  const [a, b] = position
  const aRouned = py2_round(a! * factor)
  const bRounded = py2_round(b! * factor)
  return [aRouned / factor, bRounded / factor] as GeoJSON.Position
}

export const simplifyPositions = (drawAreas: DrawArea[]) => {
  const simplified = drawAreas.map((feature) => {
    const newCoordinates = feature.geometry.coordinates[0]!.map((c) => roundPosition(c))
    const newFeature = feature
    feature.geometry.coordinates[0] = newCoordinates
    return newFeature
  })
  return simplified
}

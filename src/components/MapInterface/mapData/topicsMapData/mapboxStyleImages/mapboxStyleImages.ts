import PngCross from './images/cross.png'
import PngParkingDiagonal from './images/parking_diagonal.png'
import PngParkingPerpendicular from './images/parking_perpendicular.png'

type MapboxStyleImages = Map<string, string>

export const mapboxStyleImages: MapboxStyleImages = new Map([
  ['cross', PngCross],
  // ['oneway-white-large', 'foo'],
  ['parking_diagonal', PngParkingDiagonal],
  ['parking_perpendicular', PngParkingPerpendicular],
])

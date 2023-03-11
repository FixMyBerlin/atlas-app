import png_cross from './images/cross.png'
import png_parking_diagonal from './images/parking_diagonal.png'
import png_parking_perpendicular from './images/parking_perpendicular.png'
import png_bus_stop from './images/bus_stop.png'

type MapboxStyleImages = Map<string, string>

export const mapboxStyleImages: MapboxStyleImages = new Map([
  ['cross', png_cross],
  // ['oneway-white-large', 'foo'],
  ['parking_diagonal', png_parking_diagonal],
  ['parking_perpendicular', png_parking_perpendicular],
  ['bus_stop', png_bus_stop],
])

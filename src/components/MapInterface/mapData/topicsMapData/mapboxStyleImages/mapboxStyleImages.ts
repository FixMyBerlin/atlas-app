import png_cross from './images/cross.png'
import png_parking_diagonal from './images/parking_diagonal.png'
import png_parking_perpendicular from './images/parking_perpendicular.png'
import png_bus_stop from './images/bus_stop.png'
import png_sbahn from './images/sbahn.png'
import png_stripe_texture from './images/stripe_texture.png'

type MapboxStyleImages = Map<string, string>

export const mapboxStyleImages: MapboxStyleImages = new Map([
  ['cross', png_cross],
  // ['oneway-white-large', 'foo'],
  ['parking_diagonal', png_parking_diagonal],
  ['parking_perpendicular', png_parking_perpendicular],
  ['bus_stop', png_bus_stop],
  ['de-s-bahn', png_sbahn],
  ['pedestrian-polygon', png_parking_diagonal], // TODO Image
  ['stripe_texture', png_stripe_texture],
])

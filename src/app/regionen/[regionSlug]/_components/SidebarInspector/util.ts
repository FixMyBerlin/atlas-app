import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader'
import OverlayOp from 'jsts/org/locationtech/jts/operation/overlay/OverlayOp'
import { coordEach, polygon, difference } from '@turf/turf'
import { pick, isEqual } from 'lodash'

function createBox(nw, se) {
  return polygon([
    [
      [nw[0], nw[1]],
      [se[0], nw[1]],
      [se[0], se[1]],
      [nw[0], se[1]],
      [nw[0], nw[1]],
    ],
  ])
}

export function createBoundingPolygon(mapInstance, sidebarLayerControlsSize, inspectorSize) {
  const canvas = mapInstance.getCanvas() as HTMLElement
  const map = { width: canvas.offsetWidth, height: canvas.offsetHeight }
  const lay = sidebarLayerControlsSize
  const ins = inspectorSize
  const mapb = createBox([0, 0], [map.width, map.height])
  const layb = createBox([0, 0], [lay.width, lay.height])
  const insb = createBox([map.width - ins.width, 0], [map.width, map.height])
  // @ts-ignore
  const poly = difference(difference(mapb, layb), insb)!
  coordEach(poly, (point) => {
    const { lng, lat } = mapInstance.unproject(point)
    point[0] = lng
    point[1] = lat
  })
  return poly
}

export type Visibility = '=' | '>' | '<' | '~' | '!='

export function compareFeatures(feature1, feature2): Visibility {
  const geojsonReader = new GeoJSONReader()
  const f1 = geojsonReader.read(feature1.geometry)
  const f2 = geojsonReader.read(feature2.geometry)
  const intersected = !OverlayOp.intersection(f1, f2).isEmpty()
  if (intersected) {
    const d12 = !OverlayOp.difference(f1, f2).isEmpty()
    const d21 = !OverlayOp.difference(f2, f1).isEmpty()
    if (!d12 && !d21) {
      // feature1 and feature2 are equal
      return '='
    } else if (d12 && !d21) {
      // feature2 is completely contained in feature1
      return '>'
    } else if (!d12 && d21) {
      // feature1 is completely contained in feature2
      return '<'
    } else {
      // feature1 and feature2 intersect
      return '~'
    }
  } else {
    // feature1 and feature2 do not intersect
    return '!='
  }
}

export function findFeature(features, props) {
  const pkeys = Object.keys(props)
  return features.find((f) => {
    // we use lodash for shorter code and better readability
    const fprops = pick(f.properties, pkeys)
    return isEqual(props, fprops)
  })
}

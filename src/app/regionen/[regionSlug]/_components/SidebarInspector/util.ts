import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader'
import OverlayOp from 'jsts/org/locationtech/jts/operation/overlay/OverlayOp'
import {
  coordEach,
  point,
  polygon,
  featureCollection,
  difference,
  bbox,
  FeatureCollection,
} from '@turf/turf'
import { pick, isEqual } from 'lodash'
import { UrlFeature } from '../../_hooks/useQueryState/types'

type Bounds = [number, number, number, number]
type Points = [[number, number], [number, number]]

export function boundsToPoints(bounds: Bounds): Points {
  const [x0, y0, x1, y1] = bounds
  return [
    [x0, y0],
    [x1, y1],
  ]
}

export function createBox(points: Points) {
  const [[x0, y0], [x1, y1]] = points
  return polygon([
    [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
      [x0, y0],
    ],
  ])
}

export function getMapSize(mapInstance: any) {
  const canvas = mapInstance.getCanvas() as HTMLElement
  return { width: canvas.offsetWidth, height: canvas.offsetHeight }
}

export function createBoundingPolygon(mapInstance, sidebarLayerControlsSize, inspectorSize) {
  const map = getMapSize(mapInstance)
  const lay = sidebarLayerControlsSize
  const ins = inspectorSize
  const mapb = createBox([
    [0, 0],
    [map.width, map.height],
  ])
  const layb = createBox([
    [0, 0],
    [lay.width, lay.height],
  ])
  const insb = createBox([
    [map.width - ins.width, 0],
    [map.width, map.height],
  ])
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

export function createFeatureCollection(urlFeatures: UrlFeature[]) {
  return featureCollection(
    // @ts-expect-error - probably a bug
    urlFeatures.map((f) => (f.point ? point(f.point) : createBox(boundsToPoints(f.bbox)))),
  ) as FeatureCollection
}

export function allUrlFeaturesInBounds(urlFeatures, boundingPolygon) {
  const results: Visibility[] = urlFeatures.map((f) => {
    let feature
    if (f.point) {
      feature = point(f.point)
    } else {
      feature = createBox(boundsToPoints(f.bbox))
    }
    return compareFeatures(boundingPolygon, feature)
  })
  return results.every((r) => r === '>')
}

export function getUrlFeaturesBbox(urlFeatures: UrlFeature[]): Bounds {
  return bbox(createFeatureCollection(urlFeatures)) as Bounds
}

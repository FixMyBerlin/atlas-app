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

function geojsonFromCoordinates(coordinates: [number, number] | [number, number, number, number]) {
  return coordinates.length === 2 ? point(coordinates) : createBox(boundsToPoints(coordinates))
}

export function createFeatureCollection(urlFeatures: UrlFeature[]) {
  return featureCollection(
    // @ts-expect-error - probably a bug
    urlFeatures.map(({ coordinates }) => geojsonFromCoordinates(coordinates)),
  ) as FeatureCollection
}

export function allUrlFeaturesInBounds(urlFeatures, boundingPolygon) {
  return urlFeatures
    .map(({ coordinates }) => compareFeatures(boundingPolygon, geojsonFromCoordinates(coordinates)))
    .every((r) => ['~', '>'].includes(r))
}

export function fitBounds(mapInstance, urlFeatures, sidebarLayerControlsSize, inspectorSize) {
  const map = getMapSize(mapInstance)
  const [lay, ins] = [sidebarLayerControlsSize, inspectorSize]

  const pad = Math.floor(Math.min(map.width - ins.width - lay.width, map.height) / 10)

  const nwp = [lay.width + pad, pad]
  const sep = {
    x: map.width - ins.width - pad,
    y: map.height - pad,
  }
  const [nwc, sec] = [nwp, sep].map((p) => mapInstance.unproject(p))

  const fc = createFeatureCollection(urlFeatures)
  fc.features = [
    ...fc.features,
    createBox([
      [nwc.lng, nwc.lat],
      [sec.lng, sec.lat],
    ]),
  ]

  mapInstance.fitBounds(boundsToPoints(bbox(fc) as Bounds), {
    padding: {
      top: nwp[1],
      left: nwp[0],
      bottom: pad,
      right: ins.width + pad,
    },
  })
}

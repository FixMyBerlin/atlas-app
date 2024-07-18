import { featureCollection } from '@turf/helpers'
import { LayerSpecification } from 'maplibre-gl'
import React from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { useMapStoreLoaded } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapStateInteraction'

type Props = { layers: LayerSpecification[] }

export const DebugMapDownload: React.FC<Props> = ({ layers }) => {
  const { mainMap } = useMap()
  const mapLoaded = useMapStoreLoaded()
  if (!mapLoaded || !mainMap) return null

  const dateTody = new Date().toISOString().split('T')[0]

  const downloadLayers = layers.filter(
    (layer) =>
      mainMap.getMap().getLayer(layer.id) &&
      // @ts-ignore this weird AnyLayer issue that I don't get worked around…
      layer?.layout?.visibility === 'visible' &&
      // @ts-ignore this weird AnyLayer issue that I don't get worked around…
      !layer?.id.includes('-highlight') &&
      !layer?.id.includes('-hitarea') &&
      layer?.id.includes('default'),
  )

  // TODO: Figure out why `querySourceFeatures` does not work.
  //    https://maplibre.org/maplibre-gl-js-docs/api/map/#map#querysourcefeatures
  //    OR, confirm that `queryRenderedFeatures(undefined,{})` (undefined == current viewbox)
  //    behaves similar enough that we don't need to figure this out.
  //    The issue was, that it always returned `[]`. Even when isSourceLoaded is true
  //    (https://maplibre.org/maplibre-gl-js-docs/api/map/#map#issourceloaded)
  //    This example works, apparently https://docs.mapbox.com/mapbox-gl-js/example/query-similar-features/
  //    Next: Maybe more testing with the source prop? https://github.com/maplibre/maplibre-gl-js/issues/1952
  // mainMap
  //   .getMap()
  //   .querySourceFeatures(layer.source, {
  //     sourceLayer: layer.id,
  //     filter: ['all'],
  //   }),

  return (
    <details>
      <summary className="cursor-pointer hover:font-semibold">
        Download {downloadLayers.length}
      </summary>

      <table>
        <tbody>
          {downloadLayers.map((layer) => {
            const features = mainMap.getMap().queryRenderedFeatures(undefined, {
              layers: [layer.id],
            })
            const featureColl = featureCollection(features)

            const dataString = `data:application/json,${JSON.stringify(featureColl)}`

            return (
              <tr key={layer.id} className="border-b border-pink-200 text-left first:border-t">
                <th className="font-normal">
                  <strong>{layer.id}</strong>
                  <br />
                  {
                    // @ts-ignore again this AnyLayer issue
                    layer.source
                  }
                </th>
                <td className="whitespace-nowrap">
                  <a
                    className="underline hover:decoration-2"
                    download={`${dateTody}--${layer.id}.geojson`}
                    href={dataString}
                  >
                    Download {features.length.toLocaleString()}
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </details>
  )
}

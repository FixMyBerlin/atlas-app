import { FeatureCollection } from 'geojson'
import { WfsUrl } from './createWfsUrl'

export type FetchGeojsonFromWfs = Awaited<ReturnType<typeof fetchGeojsonFromWfs>>

export const fetchGeojsonFromWfs = async (wfsUrl: WfsUrl) => {
  const response = await fetch(wfsUrl, {
    mode: 'cors',
    redirect: 'follow',
  })

  if (!response.ok) {
    console.error(response.statusText, { statusCode: response.status, url: wfsUrl, response })
    throw new Error(response.statusText)
  }

  const jsonText = await response.text()
  const json = (await JSON.parse(jsonText)) as FeatureCollection

  return json
}

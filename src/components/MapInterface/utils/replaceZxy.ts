type Props = {
  url: string
  zoom: number
  lat: number
  lng: number
}

export const replaceZxy = ({ url, zoom, lat, lng }: Props) => {
  return url
    .replace('{z}', zoom.toString())
    .replace('{x}', lat.toString())
    .replace('{y}', lng.toString())
}

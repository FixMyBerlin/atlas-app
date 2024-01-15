// We can copy layer from Mapbox Studio, but they need to be cleaned up…
export const cleanupMapboxCopySelectedLayerJson = (layer: any) => {
  const clean = layer[0]
  delete clean.source
  delete clean['source-layer']
  return clean
}

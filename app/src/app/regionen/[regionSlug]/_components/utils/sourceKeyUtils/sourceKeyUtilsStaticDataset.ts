export const createSourceKeyStaticDatasets = (sourceId: string, subId: string | undefined) => {
  return [sourceId, subId].filter(Boolean).join('--')
}

export const createDatasetSourceLayerKey = (
  sourceId: string,
  subId: string | undefined,
  layerId: string,
) => {
  return [sourceId, subId, layerId].filter(Boolean).join('--')
}

export const extractSourceIdFromStaticDatasetSourceKey = (sourceKey: string) => {
  return sourceKey.split('--')[0]!
}

import path from 'node:path'
import { import_, tmpDir } from '../updateStaticDatasets'

/** @returns geojson outputFullFilename which is either the initial geojson or the transformed geojson  */
export const transformFile = async (
  datasetFolderPath: string,
  geojsonFullFilename: string,
  outputFolder: string,
) => {
  type TransformFunc = (data: any) => string
  const transform = await import_<TransformFunc>(datasetFolderPath, 'transform', 'transform')

  if (transform === null) {
    return geojsonFullFilename
  }

  const datasetFolderName = datasetFolderPath.split('/').at(-1)
  const outputFullFilename = path.join(outputFolder, `${datasetFolderName}.transformed.geojson`)
  console.log(`  Transforming geojson file...`, outputFullFilename)

  const data = await Bun.file(geojsonFullFilename).json()
  const transformedData = transform(data)
  Bun.write(outputFullFilename, JSON.stringify(transformedData, null, 2))

  return outputFullFilename
}

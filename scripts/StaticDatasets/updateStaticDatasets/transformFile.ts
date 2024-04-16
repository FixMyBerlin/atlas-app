import path from 'node:path'
import { import_, tmpDir } from '../updateStaticDatasets'

/** @returns geojson outputFullFilename which is either the initial geojson or the transformed geojson  */
export const transformFile = async (
  datasetFolderPath: string,
  geojsonFullFilename: string,
  outputFolder: string,
) => {
  const data = await Bun.file(geojsonFullFilename).json()

  type TransformFunc = (data: any) => string
  const transform = await import_<TransformFunc>(datasetFolderPath, 'transform', 'transform')

  const datasetFolderName = datasetFolderPath.split('/').at(-1)
  let outputFullFilename: string
  let transformedData: string
  if (transform === null) {
    outputFullFilename = path.join(outputFolder, `${datasetFolderName}.geojson`)
    transformedData = data
  } else {
    outputFullFilename = path.join(outputFolder, `${datasetFolderName}.transformed.geojson`)
    console.log(`  Transforming geojson file...`, outputFullFilename)
    transformedData = transform(data)
  }
  Bun.write(outputFullFilename, JSON.stringify(transformedData, null, 2))

  return outputFullFilename
}

import path from 'node:path'
import { import_, tmpDir } from '../updateStaticDatasets'
import adler32 from 'adler-32'

/** @returns geojson outputFullFilename which is either the initial geojson or the transformed geojson  */
export const transformFile = async (
  datasetFolderPath: string,
  geojsonFullFilename: string,
  outputFolder: string,
) => {
  let data = await Bun.file(geojsonFullFilename).json()

  type TransformFunc = (data: any) => string
  const transform = await import_<TransformFunc>(datasetFolderPath, 'transform', 'transform')

  const datasetFolderName = datasetFolderPath.split('/').at(-1)
  let outputFullFilename: string
  let transformedData: string

  outputFullFilename = path.join(outputFolder, `${datasetFolderName}.transformed.geojson`)
  if (transform !== null) {
    console.log(`  Transforming geojson file...`)
    data = transform(data)
  }
  console.log(`  Adding ids...`)
  data.features.forEach(
    (f) => (f.id = new Uint32Array([adler32.str(JSON.stringify(f))])[0]!),
  )

  await Bun.write(outputFullFilename, JSON.stringify(data, null, 2))

  return outputFullFilename
}

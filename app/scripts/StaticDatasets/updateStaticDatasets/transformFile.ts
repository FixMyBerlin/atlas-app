import path from 'node:path'
import fs from 'node:fs'
import { import_ } from '../updateStaticDatasets'
import { red } from '../utils/log'
import { addUniqueIds } from './addUniqueIds'

/** @returns geojson outputFullFilename which is either the initial geojson or the transformed geojson  */
export const transformFile = async (
  datasetFolderPath: string,
  geojsonFullFilename: string,
  outputFolder: string,
) => {
  const datasetFolderName = datasetFolderPath.split('/').at(-1)

  let filenameToRead = geojsonFullFilename
  if (path.parse(geojsonFullFilename).ext === '.gz') {
    // When our input is zipped, we copy the file to the temp folder and unzip it, which replaces the given file
    console.log(`  Unzipping file...`)
    const compressedCopy = path.join(outputFolder, `${datasetFolderName}.decompressed.geojson.gz`)
    // Using Bun.spanSync to copy the file did not work; using Bun to copy did not work either.
    fs.copyFileSync(geojsonFullFilename, compressedCopy)

    const bunFeedback = Bun.spawnSync(['gzip', '--decompress', '--force', compressedCopy], {})
    if (bunFeedback.success === false) {
      red(
        'ERROR with Bun.spawnSync gzip decompress',
        bunFeedback.stdout.toString(),
        bunFeedback.stderr.toString(),
      )
    }
    filenameToRead = compressedCopy.replace('.gz', '')
  }
  let data = await Bun.file(filenameToRead).json()

  type TransformFunc = (data: any) => string
  const transform = await import_<TransformFunc>(datasetFolderPath, 'transform', 'transform')

  if (transform !== null) {
    console.log(`  Transforming geojson file...`)
    data = transform(data)
  }

  data = addUniqueIds(data)

  const outputFullFilename = path.join(outputFolder, `${datasetFolderName}.transformed.geojson`)
  await Bun.write(outputFullFilename, JSON.stringify(data, null, 2))

  return outputFullFilename
}

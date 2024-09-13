import fs from 'node:fs'
import path from 'node:path'
import { red } from '../utils/log'

/** @description Check the file. If compressed, copy it, uncompress it, return that filename. */
export const getDecompressedFilename = ({ inputFilename, outputFilename, outputFolder }) => {
  if (path.parse(inputFilename).ext === '.gz') {
    // When our input is zipped, we copy the file to the temp folder and unzip it, which replaces the given file
    console.log(`  Unzipping file...`)
    const compressedCopy = path.join(outputFolder, `${outputFilename}.decompressed.geojson.gz`)
    // Using Bun.spanSync to copy the file did not work; using Bun to copy did not work either.
    fs.copyFileSync(inputFilename, compressedCopy)

    const bunFeedback = Bun.spawnSync(['gzip', '--decompress', '--force', compressedCopy], {})
    if (bunFeedback.success === false) {
      red(
        'ERROR with Bun.spawnSync gzip decompress',
        bunFeedback.stdout.toString(),
        bunFeedback.stderr.toString(),
      )
    }
    return compressedCopy.replace('.gz', '')
  }
  return inputFilename
}

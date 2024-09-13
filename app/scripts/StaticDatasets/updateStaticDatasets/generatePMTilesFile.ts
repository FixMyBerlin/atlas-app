import path from 'node:path'
import { red } from '../utils/log'

/** @returns pmtiles outputFullFile */
export const generatePMTilesFile = async (inputFullFile: string, outputFolder: string) => {
  const outputFilename = path.parse(inputFullFile).name
  const outputFullFile = path.join(outputFolder, `${outputFilename}.pmtiles`)

  console.log(`  Generating pmtiles file "${outputFullFile}"...`)

  Bun.spawnSync(
    [
      'tippecanoe',
      `--output=${outputFullFile}`,
      '--force',
      '--minimum-zoom=6', // Lowest zoom level for which tiles are generated (default `0`) (`6` is all of Germany on a Laptop)
      '--smallest-maximum-zoom-guess=8', // Smallest maxzoom which is acceptable for our precision requirements, is higher, if tippecanoe guesses a higher maxzoom, it will be used ttps://github.com/felt/tippecanoe#zoom-levels / Automatic --maximum-zoom didn't have the required precision
      '-rg', // If you use -rg, it will guess a drop rate that will keep at most 50,000 features in the densest tile https://github.com/felt/tippecanoe#dropping-a-fixed-fraction-of-features-by-zoom-level
      '--drop-densest-as-needed', // https://github.com/felt/tippecanoe?tab=readme-ov-file#dropping-a-fraction-of-features-to-keep-under-tile-size-limits
      '--extend-zooms-if-still-dropping', // https://github.com/felt/tippecanoe?tab=readme-ov-file#zoom-levels
      '--layer=default',
      inputFullFile,
    ],
    {
      onExit(_proc, exitCode, _signalCode, error) {
        if (exitCode) {
          red(`  exitCode: ${exitCode}`)
          process.exit(1)
        }
        if (error) {
          red(`  error: ${error.message}`)
          process.exit(1)
        }
      },
    },
  )

  return outputFullFile
}

// Takes all files from ./geojson and converts them to .pmtiles using tippecanoe.
// Install tippecanoe with `brew install tippecanoe`

// We use bun.sh to run this file
import chalk from 'chalk'
import fs from 'node:fs'
import path from 'node:path'

console.info(chalk.inverse.bold('START'), __filename)

const geojsonFiles = fs
  .readdirSync(path.resolve(__dirname, 'geojson'))
  .filter((file) => path.extname(file) === '.geojson')
  .sort((a, b) => a.localeCompare(b))

for (const file of geojsonFiles) {
  const filename = path.basename(file, '.geojson')
  const inputFile = path.resolve(__dirname, './geojson', file)
  const outputFile = `${path.resolve(__dirname, './pmtiles', filename)}.pmtiles`

  console.log(chalk.inverse.bold('INFO'), 'tippecanoe for', file)

  Bun.spawnSync(
    [
      'tippecanoe',
      `--output=${outputFile}`,
      '--force',
      '--maximum-zoom=g', // Automatically choose a maxzoom that should be sufficient to clearly distinguish the features and the detail within each feature https://github.com/felt/tippecanoe#zoom-levels
      '-rg', // If you use -rg, it will guess a drop rate that will keep at most 50,000 features in the densest tile https://github.com/felt/tippecanoe#dropping-a-fixed-fraction-of-features-by-zoom-level
      '--drop-densest-as-needed', // https://github.com/felt/tippecanoe?tab=readme-ov-file#dropping-a-fraction-of-features-to-keep-under-tile-size-limits
      '--extend-zooms-if-still-dropping', // https://github.com/felt/tippecanoe?tab=readme-ov-file#zoom-levels
      '--layer=default',
      inputFile,
    ],
    {
      onExit(_proc, exitCode, _signalCode, error) {
        exitCode && console.log('exitCode:', exitCode)
        error && console.log('error:', error)
      },
    },
  )
}

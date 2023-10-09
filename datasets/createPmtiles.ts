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

for (const file of geojsonFiles) {
  const filename = path.basename(file, '.geojson')
  const inputFile = path.resolve(__dirname, './geojson', file)
  const outputFile = `${path.resolve(__dirname, './pmtiles', filename)}.pmtiles`

  console.log(chalk.inverse.bold('INFO'), 'tippecanoe for', file)

  Bun.spawnSync(['tippecanoe', `--output=${outputFile}`, '--force', '--layer=default', inputFile], {
    onExit(_proc, exitCode, _signalCode, error) {
      exitCode && console.log('exitCode:', exitCode)
      error && console.log('error:', error)
    },
  })
}

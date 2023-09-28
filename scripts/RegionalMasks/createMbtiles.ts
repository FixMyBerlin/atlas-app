// We use bun.sh to run this file
import chalk from 'chalk'
import path from 'node:path'

// Take the file from 'createGeojson' and create a pmtiles for it in `/datasets/pmtiles`
const inputFile = path.resolve(__dirname, './geojson/atlas-regional-masks.geojson')
const outputFile = path.resolve(__dirname, '../../datasets/pmtiles', 'atlas-regional-masks.pmtiles')

console.log(chalk.inverse.bold('INFO'), 'tippecanoe for', inputFile)

Bun.spawnSync(['tippecanoe', `--output=${outputFile}`, '--force', '--layer=default', inputFile], {
  onExit(_proc, exitCode, _signalCode, error) {
    exitCode && console.log('exitCode:', exitCode)
    error && console.log('error:', error)
  },
})

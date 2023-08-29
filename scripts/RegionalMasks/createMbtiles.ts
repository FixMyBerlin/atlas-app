import { exec } from 'child_process'
import path from 'path'

// Take the file from 'createGeojson' and create a pmtiles for it in `/datasets/pmtiles`
const inputFile = path.resolve(__dirname, './geojson/atlas-regional-masks.geojson')
const outputFile = path.resolve(__dirname, '../../datasets/pmtiles', 'atlas-regional-masks.pmtiles')
const cmd = `tippecanoe --output=${outputFile} --force --layer=default ${inputFile}`

console.log('INFO: Running ', cmd, '— This will take a short while.')

// set the maxBuffer option to 10MB
exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(stdout)
  console.log(stderr)
})

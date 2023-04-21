// Takes all files from ./geojson and converts them to .pmtiles using tippecanoe.
// Install tippecanoe with `brew install tippecanoe`

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const geojsonFiles = fs
  .readdirSync(path.resolve(__dirname, 'geojson'))
  .filter((file) => path.extname(file) === '.geojson')

geojsonFiles.forEach((file) => {
  const filename = path.basename(file, '.geojson')
  const inputFile = path.resolve(__dirname, './geojson', file)
  const outputFile = `${path.resolve(__dirname, './pmtiles', filename)}.pmtiles`
  const cmd = `tippecanoe --output=${outputFile} --force --layer=default ${inputFile}`

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(stdout)
    console.log(stderr)
  })
})

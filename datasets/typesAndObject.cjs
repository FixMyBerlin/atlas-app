// Write a types.ts file that describes our datasets

const fs = require('fs')
const path = require('path')

const pmtilesFiles = fs
  .readdirSync(path.resolve(__dirname, './pmtiles'))
  .filter((file) => path.extname(file) === '.pmtiles')

const urlStrings = []
const filesNameStrings = []
const datasets = {}

pmtilesFiles.forEach((file) => {
  const urlString = `'https://atlas-tiles.s3.eu-central-1.amazonaws.com/${file}'`
  urlStrings.push(urlString)

  const filesNameString = `'${file.replace('.pmtiles', '')}'`
  filesNameStrings.push(filesNameString)

  datasets[filesNameString] = urlString
})

const typesContent = `// Auto-generated file, do not edit

export type DatasetIds =
| ${filesNameStrings.join('\n  | ')}

export type DatasetFiles =
| ${urlStrings.join('\n  | ')}`

fs.writeFileSync(
  path.resolve('./src/components/MapInterface/mapData/sourcesMapData/datasets', './types.ts'),
  typesContent
)

const objectContent = `// Auto-generated file, do not edit

export const datasets = {
  ${Object.entries(datasets)
    .map(([name, file]) => `  ${name}: ${file}`)
    .join(',\n')}
} as const`

fs.writeFileSync(
  path.resolve(
    './src/components/MapInterface/mapData/sourcesMapData/datasets',
    './datasets.const.ts'
  ),
  objectContent
)

// Write a types.ts file that describes our datasets

// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'

const pmtilesFiles = fs
  .readdirSync(path.resolve(__dirname, './pmtiles'))
  .filter((file) => path.extname(file) === '.pmtiles')

const urlStrings: string[] = []
const filesNameStrings: string[] = []
const datasets: Record<string, string> = {}

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

Bun.write(
  path.resolve('./src/core/components/MapInterface/mapData/sourcesMapData/datasets', './types.ts'),
  typesContent,
)

const objectContent = `// Auto-generated file, do not edit

export const datasets = {
  ${Object.entries(datasets)
    .map(
      ([name, file]) => `
  // Preview: https://protomaps.github.io/PMTiles/?url=${file.replaceAll("'", '')}
  ${name}: ${file},`,
    )
    .join('\n')}
} as const`

Bun.write(
  path.resolve(
    './src/core/components/MapInterface/mapData/sourcesMapData/datasets',
    './datasets.const.ts',
  ),
  objectContent,
)

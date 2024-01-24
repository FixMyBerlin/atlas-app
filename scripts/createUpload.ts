import { datasets } from '../src/app/regionen/[regionSlug]/_mapData/mapDataSources/datasets/datasets.const'
import chalk from 'chalk'
import { createUploadUrl, getRegionsUrl, getUploadsUrl, getSlugs } from './api'

const apiKey = process.env.EXPORT_ACCESS_TOKEN
const externalUrl = 'htpp://www.example.com'

const regionSlugs = await getSlugs(getRegionsUrl)
const uploadSlugs = await getSlugs(getUploadsUrl)

const yellow = (s: string) => console.log(chalk.yellow(s))
const green = (s: string) => console.log(chalk.green(s))
for (const uploadSlug in datasets) {
  const regionSlug = uploadSlug.split('-')[0]!
  const uploadUrl = datasets[uploadSlug]!

  console.log(regionSlug, uploadSlug, uploadUrl)

  if (!regionSlugs.includes(regionSlug)) {
    yellow(`  Region "${regionSlug}" does not exist.`)
    continue
  }
  if (uploadSlugs.includes(uploadSlug)) {
    yellow(`  Upload "${uploadSlug}" already exists.`)
    continue
  }

  const response = await fetch(
    new Request(createUploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        uploadSlug,
        externalUrl,
        regionSlug,
      }),
    }),
  )

  if (response.status !== 201) {
    console.error(await response.json())
    process.exit()
  }

  green('  OK')
}

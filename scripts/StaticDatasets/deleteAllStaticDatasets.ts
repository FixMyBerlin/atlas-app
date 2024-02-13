// We use bun.sh to run this file
import { deleteAllUploads } from './api'
import { green, inverse, red, yellow } from './log'

export const deleteUploadFolderOnS3 = async () => {
  yellow('  Not implemented.')
}

inverse('Deleting all datasets...')

console.log(`  Deleting S3 folder...`)
deleteUploadFolderOnS3()

console.log(`  Deleting DB entries...`)
const response = await deleteAllUploads()
if (response.status !== 200) {
  red('ERROR')
  red(JSON.stringify(await response.json(), null, 2))
  process.exit(1)
}

green('OK')

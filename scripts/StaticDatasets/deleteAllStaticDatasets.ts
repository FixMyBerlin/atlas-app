// We use bun.sh to run this file
import { deleteAllUploads } from './api'
import { green, inverse, yellow } from './log'

export const deleteUploadFolderOnS3 = async () => {
  yellow('  Not implemented.')
}

inverse('Deleting all datasets...')

console.log(`  Deleting S3 folder...`)
deleteUploadFolderOnS3()

console.log(`  Deleting DB entries...`)
await deleteAllUploads()

green('OK')

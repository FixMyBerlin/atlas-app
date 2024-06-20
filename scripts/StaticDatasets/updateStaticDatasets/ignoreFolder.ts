import { minimatch } from 'minimatch'

const DEBUG = false

function log(...args) {
  if (DEBUG) console.debug(...args)
}

export function ignoreFolder(regionAndDatasetFolder: string, ignorePatterns: string[]) {
  let ignore = false
  log('TEST - folder:', regionAndDatasetFolder)
  for (const pattern of ignorePatterns) {
    if (pattern.startsWith('!')) {
      if (minimatch(regionAndDatasetFolder, pattern.slice(1))) {
        log('  INCLUDE - pattern:', pattern)
        ignore = false
      }
    } else if (minimatch(regionAndDatasetFolder, pattern)) {
      log('  IGNORE - pattern:', pattern)
      ignore = true
    }
  }
  return ignore
}

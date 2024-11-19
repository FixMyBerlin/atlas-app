import chalk from 'chalk'
import { formatTimestamp } from './formatTimestamp'
import { synologyLogInfo } from './synology'
import { endTimer, startTimer } from './timeTracking'

const lineLength = process.stdout.columns || 120

export function logPadded(left: string, right: string = '') {
  console.log(chalk.inverse(left.padEnd(lineLength - right.length) + right))
}
export async function logStart(id: string) {
  const message = `${id} started`
  await synologyLogInfo(message)
  logPadded(message)
  startTimer(id)
}

export async function logEnd(id: string) {
  const timeElapsed = endTimer(id)
  const timeFormatted = formatTimestamp(timeElapsed)

  const message = `${id} finished`
  synologyLogInfo(`${message} in ${timeFormatted}`)
  logPadded(message, timeFormatted)
  return timeElapsed
}

export function logTileInfo(environment: string) {
  const tileURLs = {
    development: 'http://localhost:3000/catalog',
    staging: 'https://staging-tiles.radverkehrsatlas.de/catalog',
    production: 'https://tiles.radverkehrsatlas.de/catalog',
  } as const
  if (environment in tileURLs) {
    console.log('Tile Inspector: https://viewer.radverkehrsatlas.de/index.html')
    console.log(`Tile Catalog:   ${tileURLs[environment as keyof typeof tileURLs]}`)
  }
}

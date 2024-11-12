import chalk from 'chalk'
import { formatTimestamp } from './formatTimestamp'
import { logInfo } from './synology'
import { endTimer, startTimer } from './timeTracking'

const lineLength = process.stdout.columns || 120

export function logPadded(left: string, right: string = '') {
  console.log(chalk.inverse(left.padEnd(lineLength - right.length) + right))
}
export function logStart(id: string) {
  const message = `${id} started`
  logInfo(message)
  logPadded(message)
  startTimer(id)
}

export function logEnd(id: string) {
  const timeElapsed = endTimer(id)
  const message = `${id} finished`
  logInfo(message)
  logPadded(message, formatTimestamp(timeElapsed))
  return timeElapsed
}

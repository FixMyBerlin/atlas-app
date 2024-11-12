import chalk from 'chalk'
import type { Topic } from '../constants/topics.const'
import { formatTimestamp } from './formatTimestamp'
import { logInfo } from './synology'
import { endTimer, startTimer } from './timeTracking'

const startTimes: Partial<Record<Topic, number>> = {}
const lineLength = process.stdout.columns || 80
export function logStart(topic: Topic) {
  logInfo(`Processing ${topic} started`)
  const message = `Processing ${topic} started`
  const padding = ' '.repeat(Math.max(0, lineLength - message.length))
  console.log(chalk.inverse(message + padding))
  startTimer(topic)
}

export function logEnd(topic: Topic) {
  if (!startTimes[topic]) {
    throw new Error(`Processing ${topic} ended before it started`)
  }
  const timeElapsed = formatTimestamp(endTimer(topic))
  logInfo(`Processing ${topic} finished`)
  const message = `Processing ${topic} finished`
  const padding = ' '.repeat(Math.max(0, lineLength - message.length - timeElapsed.length))
  console.log(chalk.inverse(message + padding + timeElapsed))
}

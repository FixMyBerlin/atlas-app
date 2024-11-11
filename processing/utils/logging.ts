import chalk from 'chalk'
import type { Topic } from '../topics.const'
import { formatTimestamp } from './formatTimestamp'
import { logInfo } from './synology'

const startTimes: Partial<Record<Topic, number>> = {}
export function logStart(topic: Topic) {
  logInfo(`Processing ${topic} started`)
  console.log(chalk.black.bgWhite(`Processing ${topic} started)`))
  startTimes[topic] = Date.now()
}

export function logEnd(topic: Topic) {
  if (!startTimes[topic]) {
    throw new Error(`Processing ${topic} ended before it started`)
  }
  const timeElapsed = formatTimestamp(Date.now() - startTimes[topic])
  logInfo(`Processing ${topic} finished`)
  console.log(chalk.black.bgWhite(`Processing ${topic} finished in ${timeElapsed}`))
}

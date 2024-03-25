#!/usr/bin/env bun

import { program, Option, Argument } from 'commander'
import chalk from 'chalk'

import {
  parseSizeOption,
  parseTimeOption,
  checkFile,
  getLogData,
  isError,
  isRequest,
  parseResponse,
} from './util'

// prettier-ignore
{
  program
    .name('filterLog')
    .description('Filter logfile created by warmCache')
    .addOption(new Option('-e, --skip-errors', 'exclude warnings and errors').default(false))
    .addOption(new Option('-i, --skip-info', 'exclude additional information').default(false))
    // -x to not mask --help
    .addOption(new Option('-x, --hit', 'include only cache hits').conflicts('miss').default(false))
    .addOption(new Option('-m, --miss', 'include only cache misses').conflicts('hit').default(false))
    .addOption(new Option('-s, --size <bytes>', 'include if the tilesize is at least <bytes>').argParser(parseSizeOption).default(0))
    .addOption(new Option('-t, --time <seconds>', 'include if the response time is at least <seconds>').argParser(parseTimeOption).default(0))
    .addOption(new Option('-g, --grep <pattern>', 'include if the url matches <pattern>').default(false))
    .addOption(new Option('-v, --invert-match', 'exclude if the url matches <pattern> given by -g, --grep').default(false))
  if (process.stdin.isTTY !== undefined) {
    program.addArgument(new Argument('<logfile>').argParser(checkFile))
  }
  program.addHelpText('after', `
Example call:
  $ ./filterLog.ts --grep="roads\\/(11|10)" --hit --size=500K --time=1 warm-cache.log`);
  program.showHelpAfterError('(add --help for additional information)');
}
program.parse(process.argv)
const opts = program.opts()

// ================================================================================

const logData = await getLogData(program.args[0])

let i = 0
while (i < logData.length) {
  const line = logData[i]!
  if (!isRequest(line)) {
    if (!opts.skipInfo) {
      console.log(line)
    }
    i++
    continue
  }

  let request = line
  if (opts.grep) {
    const colorString = (s, toColor) => {
      const start = s.search(toColor)
      const end = start + toColor.length
      return s.slice(0, start) + chalk.red(toColor) + s.slice(end)
    }
    let [a, b, url] = request.split(' - ')
    const matches = Array.from(url!.matchAll(new RegExp(opts.grep, 'g')))
    matches.forEach((match) => (url = colorString(url, match[0])))
    request = [a, b, url].join(' - ')
    let found = matches.length > 0
    if (opts.invertMatch) found = !found
    if (!found) {
      i += 2
      continue
    }
  }

  const response = logData[i + 1]!
  if (!response) break

  const { cacheStatus, time, size } = parseResponse(response)
  if (isError(response)) {
    if (!opts.skipErrors) {
      console.log(request)
      console.log(response)
    }
    i += 2
    continue
  }

  if (opts.hit && cacheStatus !== 'HIT') {
    // don't log
  } else if (opts.miss && cacheStatus !== 'MISS') {
    // don't log
  } else if (opts.size === null && opts.time === null) {
    // don't log if neither size nor time is given
  } else {
    const logSize = size! >= opts.size
    const logTime = time! >= opts.time
    if (logSize && logTime) {
      console.log(request)
      console.log(response)
    }
  }
  i += 2
}

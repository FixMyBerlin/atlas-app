#!/usr/bin/env bun

import { parseArgs } from 'node:util'
import fs from 'node:fs'
import chalk from 'chalk'
import { parseSize, parseTime, displayFilterLogHelp, isError, isRequest } from './util'

function error(message) {
  console.error(message)
  process.exit()
}

let parsed: any
try {
  parsed = parseArgs({
    options: {
      help: { type: 'boolean', default: false },
      size: { type: 'string', short: 's' },
      time: { type: 'string', short: 't' },
      grep: { type: 'string', short: 'g' },
      'skip-errors': { type: 'boolean', short: 'e', default: false },
      hit: { type: 'boolean', short: 'h', default: false },
      miss: { type: 'boolean', short: 'm', default: false },
    },
    strict: true,
    allowPositionals: true,
  })
} catch (e) {
  error(e.message)
}

const { values, positionals } = parsed

const args = {
  help: values.help,
  skipErrors: values['skip-errors'],
  minSize: 'size' in values ? parseSize(values.size) : null,
  minTime: 'time' in values ? parseTime(values.time) : null,
  grep: values.grep || null,
  hit: values.hit,
  miss: values.miss,
}

if (values.help) {
  displayFilterLogHelp()
  process.exit(0)
}

if (positionals.length === 0) error('Logfile argument is missing.')
if (positionals.length > 1) error('Too many arguments.')
const filename = positionals[0]
if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)
if (args.hit && args.miss) error('Supply only one of "hit" or "miss"')

const logData = (await Bun.file(filename).text()).split('\n')
let i = 0
while (i < logData.length) {
  const line = logData[i]!
  if (!isRequest(line)) {
    console.log(line)
    i++
    continue
  }

  let request = line
  if (args.grep) {
    const f0 = request.search(args.grep)
    if (f0 === -1) {
      i += 2
      continue
    } else {
      const f1 = f0 + args.grep.length
      request = request.slice(0, f0) + chalk.red(request.slice(f0, f1)) + request.slice(f1)
    }
  }
  const response = logData[i + 1]!
  if (!response) break

  let [cacheStatus, timeFormatted, sizeFormatted] = response.slice(2).split(' - ')
  if (isError(response)) {
    if (!args.skipErrors) {
      console.log(request)
      console.log(response)
    }
  } else if (args.hit && cacheStatus !== 'HIT') {
    // don't log
  } else if (args.miss && cacheStatus !== 'MISS') {
    // don't log
  } else if (args.minSize === null && args.minTime === null) {
    // don't log if neither minSize nor minTime is given
  } else {
    let [cacheStatus, timeFormatted, sizeFormatted] = response.slice(2).split(' - ')
    const logSize = args.minSize === null ? false : parseSize(sizeFormatted) >= args.minSize
    const logTime = args.minTime === null ? false : parseTime(timeFormatted) >= args.minTime
    if (logSize || logTime) {
      console.log(request)
      console.log(response)
    }
  }
  i += 2
}

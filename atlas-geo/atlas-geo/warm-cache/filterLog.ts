#!/usr/bin/env bun

import { parseArgs } from 'node:util'
import fs from 'node:fs'
import chalk from 'chalk'
import {
  parseSize,
  parseTime,
  displayFilterLogHelp,
  isError,
  isRequest,
  parseResponse,
} from './util'

function error(message) {
  console.error(message)
  process.exit()
}

let parsed: any
try {
  parsed = parseArgs({
    options: {
      help: { type: 'boolean', default: false },
      size: { type: 'string', short: 's', default: '0' },
      time: { type: 'string', short: 't', default: '0' },
      grep: { type: 'string', short: 'g' },
      'skip-errors': { type: 'boolean', short: 'e', default: false },
      'skip-info': { type: 'boolean', short: 'i', default: false },
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
  skipInfo: values['skip-info'],
  minSize: parseSize(values.size),
  minTime: parseTime(values.time),
  grep: values.grep || null,
  hit: values.hit,
  miss: values.miss,
}

if (positionals.length === 0) error('Logfile argument is missing.')
if (positionals.length > 1) error('Too many arguments.')
const filename = positionals[0]
if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)
if (args.minSize === null) error(`Could not parse size "${values.size}".`)
if (args.minTime === null) error(`Could not parse time "${values.time}".`)
if (args.hit && args.miss) error('Supply only one of "hit" or "miss"')
if (values.help) {
  displayFilterLogHelp()
  process.exit(0)
}

const logData = (await Bun.file(filename).text()).split('\n')
let i = 0
while (i < logData.length) {
  const line = logData[i]!
  if (!isRequest(line)) {
    if (!args.skipInfo) {
      console.log(line)
    }
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

  const { cacheStatus, time, size } = parseResponse(response)
  if (isError(response)) {
    if (!args.skipErrors) {
      console.log(request)
      console.log(response)
    }
    i += 2
    continue
  }

  if (args.hit && cacheStatus !== 'HIT') {
    // don't log
  } else if (args.miss && cacheStatus !== 'MISS') {
    // don't log
  } else if (args.minSize === null && args.minTime === null) {
    // don't log if neither minSize nor minTime is given
  } else {
    const logSize = size! >= args.minSize!
    const logTime = time! >= args.minTime!
    if (logSize && logTime) {
      console.log(request)
      console.log(response)
    }
  }
  i += 2
}

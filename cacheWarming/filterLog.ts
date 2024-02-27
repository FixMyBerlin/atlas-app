#!/usr/bin/env bun

import { parseArgs } from 'node:util'
import fs from 'node:fs'
import chalk from "chalk";

function error(message) {
  console.error(message)
  process.exit()
}

let parsed: any
try {
  parsed = parseArgs({
    options: {
      'min-size': { type: 'string' },
      'min-time': { type: 'string' },
      grep: { type: 'string' },
      'skip-errors': { type: 'boolean', default: false },
      hit: { type: 'boolean', default: false },
      miss: { type: 'boolean', default: false },
    },
    strict: true,
    allowPositionals: true,
  })
} catch (e) {
  error(e.message)
}

const { values, positionals } = parsed

const args = {
  skipErrors: values['skip-errors'],
  minSize: 'min-size' in values ? parseSize(values['min-size']) : null,
  minTime: 'min-time' in values ? parseTime(values['min-time']) : null,
  grep: values.grep || null,
  hit: values.hit,
  miss: values.miss,
}

if (positionals.length === 0) error('Logfile argument is missing.')
if (positionals.length > 1) error('Too many arguments.')
const filename = positionals[0]
if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)
if (args.hit && args.miss) error('Supply only one of "hit" or "miss"')

function parseNumber(valueName) {
  if (!(valueName in values)) return null
  const v = Number(values[valueName])
  if (isNaN(v)) error(`Argument "${valueName}" is not a number.`)
  return v
}

function parseTime(time) {
  const num = Number(time)
  if (!isNaN(num)) return time
  const m = time.trim().match(/^([0-9]+\.[0-9]{3})s$/)
  if (!m) error(`Could not parse time "${time}".`)
  return Number(m[1])
}

function parseSize(size) {
  const num = Number(size)
  if (!isNaN(num)) return num
  const m = size.trim().match(/^([0-9.]+)([BKMG])$/)
  if (!m) error(`Could not parse size "${size}".`)
  let [_, bytes, unit] = m
  return Math.round(
    bytes *
      {
        B: 1,
        K: 1024,
        M: 1024 ** 2,
        G: 1024 ** 3,
      }[unit],
  )
}

const logData = (await Bun.file(filename).text()).split('\n')
let i = 0
while (i < logData.length) {
  const line = logData[i]!
  if (!'🡇✓⚠'.split('').includes(line[0]!)) {
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
  if (response.startsWith('⚠')) {
    if (!args.skipErrors) {
      console.log(request)
      console.log(response)
    }
  } else if (args.hit && cacheStatus !== 'HIT') {
    // don't log
  } else if (args.miss && cacheStatus !== 'MISS') {
    // don't log
  } else if (args.minSize === null && args.minTime === null) {
    // don't log if neither min-size nor min-time is given
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

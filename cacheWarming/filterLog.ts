#!/usr/bin/env bun

import { parseArgs } from 'node:util'
import fs from 'node:fs'

function error(message) {
  console.error(message)
  process.exit()
}

let parsed: any
try {
  parsed = parseArgs({
    options: {
      'no-errors': { type: 'boolean' },
      'min-size': { type: 'string' },
      'min-time': { type: 'string' },
      'grep': { type: 'string' },
      hit: { type: 'boolean', short: 'h' },
      miss: { type: 'boolean', short: 'm' },
    },
    strict: true,
    allowPositionals: true,
  })
} catch (e) {
  error(e.message)
}

const { values, positionals } = parsed

if (positionals.length === 0) error('Logfile argument is missing.')
if (positionals.length > 1) error('Too many arguments.')
const filename = positionals[0]
if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)
if ('hit' in values && 'miss' in values) error('Supply only one of "hit" or "miss"')
if ('and' in values && 'or' in values) error('Supply one of "and" or "or"')

function parseNumber(valueName) {
  if (!(valueName in values)) return null
  const v = Number(values[valueName])
  if (isNaN(v)) error(`Argument "${valueName}" is not a number.`)
  return v
}

const minSize = 'min-size' in values ? parseSize(values['min-size']) : null
const minTime = 'min-time' in values ? parseTime(values['min-time']) : null

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
  const request = line
  if (('grep' in values)) {
    if (request.search(values.grep) === -1) {
      i += 2
      continue
    }
  }
  const response = logData[i + 1]!
  if (!response) break
  if (response.startsWith('⚠')) {
    if (!('no-errors' in values)) {
      console.log(request)
      console.log(response)
    }
  } else if (minSize === null && minTime === null) {
    // don't log if neither min-size nor min-time is given
  } else {
    let [cacheStatus, timeFormatted, sizeFormatted] = response.slice(2).split(' - ')
    const logSize = minSize === null ? false : parseSize(sizeFormatted) >= minSize
    const logTime = minTime === null ? false : parseTime(timeFormatted) >= minTime
    if (logSize || logTime) {
      console.log(request)
      console.log(response)
    }
  }
  i += 2
}

#!/usr/bin/env bun

import { parseArgs } from 'node:util'
import fs from 'node:fs'
import {
  parseSize,
  parseTime,
  displaySortLogHelp,
  removeTimeStamp,
  isError,
  parseResponse, isRequest,
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
    },
    strict: true,
    allowPositionals: true,
  })
} catch (e) {
  error(e.message)
}

const { values, positionals } = parsed

if (values.help) {
  displaySortLogHelp()
  process.exit(0)
}

if (positionals.length === 0) error('Logfile argument is missing.')
if (positionals.length > 1) error('Too many arguments.')
const filename = positionals[0]
if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)

const toSort: [number, string, string][] = []
const logData = (await Bun.file(filename).text()).split('\n')
let i = 0
while (i < logData.length) {
  const line = logData[i]!
  if (!isRequest(line)) {
    i++
    continue
  }
  let request = line
  const response = logData[i + 1]!
  if (!response) break

  if (isError(response)) {
    i += 2
    continue
  }

  const { size } = parseResponse(response)
  toSort.push([size, request, response])

  i += 2
}

toSort.sort((a, b) => {
  if (a[0] < b[0]) {
    return -1
  } else if (a[0] > b[0]) {
    return 1
  }
  return 0
})

toSort.forEach(([size, request, response]) => {
  console.log(request)
  console.log(response)
})

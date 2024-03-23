#!/usr/bin/env bun

import { parseArgs } from 'node:util'

import { displaySortLogHelp, isError, parseResponse, isRequest, getLogData, error } from './util'

let parsed: any
try {
  parsed = parseArgs({
    options: {
      help: { type: 'boolean', default: false },
      desc: { type: 'boolean', short: 'd', default: false },
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

const logData = await getLogData(positionals)

const toSort: [number, string, string][] = []
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
  toSort.push([size!, request, response])

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

if (values.desc) {
  toSort.reverse()
}

toSort.forEach(([size, request, response]) => {
  console.log(request)
  console.log(response)
})

#!/usr/bin/env bun

import { program, Option, Argument } from 'commander'

import { getLogData, isError, isRequest, parseResponse, checkFile} from './util'

// prettier-ignore
{
  program
    .name('filterLog')
    .description('Sort logfile created by warmCache')
    .addOption(new Option('-d, --desc', 'sort by from high to low').default(false))
  if (process.stdin.isTTY !== undefined) {
    program.addArgument(new Argument('<logfile>').argParser(checkFile))
  }
  program.showHelpAfterError('(add --help for additional information)');
}
program.parse(process.argv)
const opts = program.opts()

// ================================================================================

const logData = await getLogData(program.args[0])

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

if (opts.desc) {
  toSort.reverse()
}

toSort.forEach(([size, request, response]) => {
  console.log(request)
  console.log(response)
})

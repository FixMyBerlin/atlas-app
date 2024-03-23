#!/usr/bin/env bun

import fs from 'node:fs'
import { parseArgs } from 'node:util'
import { flattenDeep, sumBy, max, uniq } from 'lodash'
import { bbox, point, distance } from 'turf'
// @ts-ignore
import { consoleTable } from 'js-awe'

import { displaySortLogHelp, formatBytes, error } from './util'

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

if (positionals.length === 0) error('Geojson argument is missing.')
if (positionals.length === 1) error('Property argument is missing.')
if (positionals.length > 2) error('Too many arguments.')

const filename = positionals[0]
if (!filename.endsWith('.geojson')) error('File is not a .geojson')
if (!fs.existsSync(filename)) error(`File "${filename}" not found.`)

const file = Bun.file(filename)
const layers = await file.json()
const property = positionals[1]

const breakdownByValue = {}

function diagonal(feature) {
  const [minX, minY, maxX, maxY] = bbox(feature)
  return distance(point([minX, minY]), point([maxX, maxY])) * 1000
}

function createNumberGroupingFunction(maxValue, numGroups) {
  const stepFloat = maxValue / numGroups
  const exp = Math.floor(Math.log10(stepFloat))
  const step = Math.round(stepFloat / 10 ** exp) * 10 ** exp
  const maxStep = (numGroups - 1) * step
  const precision = Math.max(0, -exp)
  return (value) => {
    value = Number(value)
    if (isNaN(value)) return 'missing'
    const ceil = Math.ceil((value + 1) / step) * step
    if (ceil > maxStep) return `> ${maxStep}`
    return `${(ceil - step).toFixed(precision)} - ${(ceil - 1).toFixed(precision)}`
  }
}

layers.forEach((layer) => {
  let groupingFn = (value: any): any => null
  if (property === 'diagonal()') {
    const maxDiagonal = max(layer.features.map((feature) => diagonal(feature)))
    groupingFn = createNumberGroupingFunction(maxDiagonal, 10)
  } else {
    const valueTypes = uniq(layer.features.map((f) => typeof f.properties[property]))
    if (valueTypes.length === 1 && valueTypes[0] === 'undefined') {
      // all values undefined
      groupingFn = (value) => 'undefined'
    } else if (valueTypes.includes('string') && valueTypes.includes('number')) {
      throw new Error(`can't handle mixed strings and numbers.`)
    } else if (valueTypes.includes('string')) {
      groupingFn = (value) => value
    } else if (valueTypes.includes('number')) {
      const maxValue = max(layer.features.map((f) => f.properties[property]))
      groupingFn = createNumberGroupingFunction(maxValue, 10)
    } else {
      throw new Error(`can't handle ${valueTypes}`)
    }
  }

  layer.features.forEach((feature) => {
    let value
    if (property === 'diagonal()') {
      value = groupingFn(diagonal(feature))
    } else {
      value = groupingFn(feature.properties[property])
    }
    if (!(value in breakdownByValue))
      breakdownByValue[value] = { layer: layer.name, property, value, ints: 0 }
    const ints = flattenDeep(feature.geometry.coordinates).length
    breakdownByValue[value].ints += ints
  })
})

const breakdown = Object.values(breakdownByValue)

breakdown.sort((a: any, b: any) => {
  if (a.ints > b.ints) {
    return -1
  } else if (a.ints < b.ints) {
    return 1
  }
  return 0
})

const sumInts = sumBy(breakdown, ({ ints }) => ints)
consoleTable(
  breakdown.map(({ layer, value, ints }) => ({
    layer,
    [property]: value,
    int32: ints,
    size: formatBytes(ints * 4, false),
    '%': ((ints / sumInts) * 100).toFixed(1),
  })),
)

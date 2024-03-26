#!/usr/bin/env bun

import { program, Option, Argument } from 'commander'
import { flattenDeep, sumBy, max, uniq } from 'lodash'
import { bbox, point, distance } from 'turf'
// @ts-ignore
import { consoleTable } from 'js-awe'

import { checkFile, createParseIntOption, error, formatBytes } from './util'

// prettier-ignore
{
  program
    .name('analyzeTile')
    .description('Analyze a geojson and display sizes grouped by property values')
    .addOption(new Option('-p, --prop <prop>', 'group by property <prop>'))
    .addOption(new Option('-g, --grouper <name>', 'specify grouping method').choices(['diagonals']))
    .addOption(new Option('-a, --sort-asc [column]', 'sort by size or group from low to high').conflicts('sortDesc').choices(['size', 'group']))
    .addOption(new Option('-d, --sort-desc [column]', 'sort by size or group from high to low').conflicts('sortAsc').choices(['size', 'group']))
    .addOption(new Option('-n, --num-groups <count>', 'number of groups for numeric properties').default(10).argParser(createParseIntOption(2 , 100)))
  program.addArgument(new Argument('<logfile>').argParser(checkFile))
  program.addArgument(new Argument('[property]'))
  program.showHelpAfterError('(add --help for additional information)');
}
program.parse(process.argv)
const opts = program.opts()

// ================================================================================

const filename = program.args[0]

console.log(`Analyzing ${filename}...`)

const file = Bun.file(filename!)
const layers = await file.json()

const breakdownByGroup = {}

function createNumberGroupingFunction(maxValue) {
  const stepFloat = maxValue / opts.numGroups
  const exp = Math.floor(Math.log10(stepFloat))
  const step = Math.round(stepFloat / 10 ** exp) * 10 ** exp
  const maxStep = (opts.numGroups - 1) * step
  const precision = Math.max(0, -exp)
  return (value) => {
    value = Number(value)
    if (isNaN(value)) return 'missing'
    const ceil = Math.ceil((value + 1) / step) * step
    // if (ceil > maxStep) return `${maxStep} - ...`
    const key = ceil - step
    const label = `${(ceil - step).toFixed(precision)} - ${(ceil - 1).toFixed(precision)}`
    return { key, label }
  }
}

const groupers = {
  undefined: () => ({
    getGroup: (feature) => ({ key: '', label: 'undefined' }),
  }),
  string: () => ({
    getGroup: (feature) => {
      const key = feature.properties[opts.prop]
      return { key, label: key }
    },
  }),
  number: () => {
    let groupingFn
    return {
      prepare: (layer) => {
        const maxValue = max(layer.features.map((f) => f.properties[opts.prop]))
        groupingFn = createNumberGroupingFunction(maxValue)
      },
      getGroup: (feature) => groupingFn(feature.properties[opts.prop]),
    }
  },
  diagonals: () => {
    let groupingFn
    function diagonal(feature) {
      const [minX, minY, maxX, maxY] = bbox(feature)
      return distance(point([minX, minY]), point([maxX, maxY])) * 1000
    }
    return {
      prepare: (layer) => {
        const maxDiagonal = max(layer.features.map((feature) => diagonal(feature)))
        groupingFn = createNumberGroupingFunction(maxDiagonal)
      },
      getGroup: (feature) => groupingFn(diagonal(feature)),
    }
  },
}

layers.forEach((layer) => {
  let grouper
  const valueTypes = uniq(layer.features.map((f) => typeof f.properties[opts.prop]))
  if (opts.grouper) {
    grouper = groupers[opts.grouper]()
  } else if (valueTypes.length === 1 && valueTypes[0] === 'undefined') {
    grouper = groupers.undefined()
  } else if (valueTypes.includes('string')) {
    grouper = groupers.string()
  } else if (valueTypes.includes('number')) {
    grouper = groupers.number()
  } else {
    error(`can't handle ${valueTypes}`)
  }

  grouper.prepare && grouper.prepare(layer)

  layer.features.forEach((feature) => {
    const group = grouper.getGroup(feature)
    // console.log('X', group);
    if (!(group.key in breakdownByGroup)) {
      breakdownByGroup[group.key] = { layer, group, ints: 0 }
    }
    const ints = flattenDeep(feature.geometry.coordinates).length
    breakdownByGroup[group.key].ints += ints
  })
})

const breakdown = Object.values(breakdownByGroup)

const { sortAsc, sortDesc } = opts
const sortOrder = sortDesc ? 'desc' : 'asc'
let sortProp = sortDesc || sortAsc
if (typeof sortProp !== 'string') sortProp = 'ints'
const getSortKey = (sortProp === 'ints') ? (row) => row.ints : (v) => v.group.key

const sortingFn = (a: any, b: any) => {
  a = getSortKey(a)
  b = getSortKey(b)
  if (a < b) return -1
  else if (a > b) return 1
  return 0
}

breakdown.sort(sortingFn)
if (sortOrder === 'desc') {
  breakdown.reverse()
}

const sumInts = sumBy(breakdown, ({ ints }) => ints)
// prettier-ignore
const cumulativeSum = ((sum) => (v) => (sum += v))(0)
consoleTable(
  breakdown.map(({ layer, group, ints }) => {
    const cumInts = cumulativeSum(ints)
    return {
      layer: layer.name,
      [opts.prop || opts.grouper]: group.label,
      int32: ints,
      size: formatBytes(ints * 4, false),
      'size %': ((ints / sumInts) * 100).toFixed(1),
      cum: formatBytes(cumInts * 4, false),
      'cum %': ((cumInts / sumInts) * 100).toFixed(1),
    }
  }),
)

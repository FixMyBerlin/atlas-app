import fetch from 'node-fetch'
import fs from 'node:fs'
import {log} from './util/util.js'

const dataFolder = '/data'
const giveupTime = '06:00:00' // time of day when to give up (utc)
const waitBetweenAttempts = 10 * 60 // in seconds
const url = process.argv[2]

const path = (new URL(url)).pathname.split('/')
const osmFilename = path[path.length - 1]
const osmLastModifiedFilename = `${dataFolder}/${osmFilename}.last-modified`

let previousLastModified
if (fs.existsSync(osmLastModifiedFilename)) {
  previousLastModified = new Date(fs.readFileSync(osmLastModifiedFilename, 'utf-8').trim())
} else {
  log(`Creating ${osmLastModifiedFilename} because it does not exist.`)
  previousLastModified = new Date(0)
  fs.writeFileSync(osmLastModifiedFilename, previousLastModified.toISOString())
}

log('previousLastModified:', previousLastModified)

function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

let attempt = 1
while (true) {
  const att = `[${attempt}]`
  log(att, 'Checking if new data is available...')
  const response = await fetch(url, {method: 'HEAD'})
  const lastModified = new Date(response.headers.get('last-modified'))
  if (lastModified > previousLastModified) {
    log(att, 'Fresh data is available. lastModified:', lastModified.toISOString())
    fs.writeFileSync(osmLastModifiedFilename, lastModified.toISOString())
    break
  }
  const currentTime = (new Date(new Date().toUTCString())).toISOString().split('T')[1].split('.')[0]
  if (currentTime >= giveupTime) {
    log(att, `Fresh data is not available yet. It's after ${giveupTime} now. Exiting.`)
    break
  } else {
    log(att, `Fresh data is not available yet. Retrying in ${waitBetweenAttempts}s...`)
    attempt += 1
    await sleep(waitBetweenAttempts)
  }
}

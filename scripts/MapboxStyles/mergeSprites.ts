import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import os from 'os'
const Spritesmith = require('spritesmith')

import { saveJson } from './util'

type Sprite = { url: string; searchParams: Record<string, string> }

function generateSpriteUrl(sprite: Sprite, pixelRatio: 1 | 2, extension: 'png' | 'json') {
  const completeUrl = `${sprite.url}${pixelRatio === 1 ? '' : '@2x'}.${extension}`
  const url = new URL(completeUrl)
  if (sprite.searchParams) {
    Object.entries(sprite.searchParams).forEach(([name, value]) =>
      url.searchParams.append(name, String(value)),
    )
  }
  return url.toString()
}

async function fetchResponse(sprite: Sprite, pixelRatio: 1 | 2, extension: 'png' | 'json') {
  const url = generateSpriteUrl(sprite, pixelRatio, extension)
  console.log('Fetching', url, '...')
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return response
}

export async function mergeSprites(sprites, pixelRatio: 1 | 2) {
  const iconFiles = {}
  const tmpFolder = path.join(os.tmpdir(), 'icons')
  fs.rmSync(tmpFolder, { recursive: true, force: true })
  fs.mkdirSync(tmpFolder)

  const extractIcons = async (imageBuffer, coordinates) => {
    await Promise.all(
      Object.entries(coordinates).map(async ([key, position]) => {
        // @ts-ignore
        const { x, y, width, height } = position
        const filename = path.join(os.tmpdir(), `${key}.png`)
        await sharp(imageBuffer).extract({ left: x, top: y, width, height }).toFile(filename)
        iconFiles[key] = filename
      }),
    )
  }

  await Promise.all(
    sprites.map(async (sprite) => {
      let response
      response = await fetchResponse(sprite, pixelRatio, 'png')
      const imageBuffer = Buffer.from(await response.arrayBuffer())
      response = await fetchResponse(sprite, pixelRatio, 'json')
      const coordinates = await response.json()
      await extractIcons(imageBuffer, coordinates)
    }),
  )

  const iconFilenameToKey = Object.fromEntries(
    Object.entries(iconFiles).map(([key, fileName]) => [fileName, key]),
  )

  const filename = `public/map/sprite${pixelRatio === 1 ? '' : '@2x'}`
  console.log('Creating', filename, '...')
  Spritesmith.run({ src: Object.values(iconFiles) }, async (err, result) => {
    if (err) throw err
    await sharp(result.image).toFile(`${filename}.png`)
    const coordinates = Object.fromEntries(
      Object.entries(result.coordinates).map(([filename, coords]) => [
        iconFilenameToKey[filename],
        coords,
      ]),
    )
    Object.values(coordinates).forEach((coords) => {
      // @ts-ignore
      coords.pixelRatio = pixelRatio
    })
    await saveJson(`${filename}.json`, coordinates)
    fs.rmSync(tmpFolder, { recursive: true, force: true })
  })
}

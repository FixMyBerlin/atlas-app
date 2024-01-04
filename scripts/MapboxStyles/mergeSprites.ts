import fs from 'node:fs'
import path from 'node:path'
import os from 'os'
import sharp from 'sharp'
import Spritesmith from 'spritesmith'
import { SpriteSource } from './process'
import { saveJson, sortObject } from './util'

function generateSpriteUrl(sprite: SpriteSource, pixelRatio: 1 | 2, extension: 'png' | 'json') {
  const completeUrl = `${sprite.url}${pixelRatio === 1 ? '' : '@2x'}.${extension}`
  const url = new URL(completeUrl)
  if (sprite.searchParams) {
    Object.entries(sprite.searchParams).forEach(([name, value]) => {
      url.searchParams.append(name, String(value))
    })
  }
  return url.toString()
}

async function fetchResponse(sprite: SpriteSource, pixelRatio: 1 | 2, extension: 'png' | 'json') {
  const url = generateSpriteUrl(sprite, pixelRatio, extension)
  console.log('Fetching', url, '...')
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return response
}

export async function mergeSprites(sprites: SpriteSource[], pixelRatio: 1 | 2) {
  const iconFiles = {}
  const tmpFolder = path.join(os.tmpdir(), 'icons')
  fs.rmSync(tmpFolder, { recursive: true, force: true })
  fs.mkdirSync(tmpFolder)

  const extractIcons = async (imageBuffer, coordinates) => {
    for (const [key, position] of Object.entries(coordinates)) {
      // @ts-ignore
      const { x, y, width, height } = position
      const filename = path.join(os.tmpdir(), `${key}.png`)
      await sharp(imageBuffer).extract({ left: x, top: y, width, height }).toFile(filename)
      iconFiles[key] = filename
    }
  }

  for (const sprite of sprites) {
    const imageResponse = await fetchResponse(sprite, pixelRatio, 'png')
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
    const coordinateResponse = await fetchResponse(sprite, pixelRatio, 'json')
    const coordinates = await coordinateResponse.json()
    await extractIcons(imageBuffer, coordinates)
  }

  const iconFilenameToKey = Object.fromEntries(
    Object.entries(iconFiles).map(([key, fileName]) => [fileName, key]),
  )

  const filename = `public/map/sprite${pixelRatio === 1 ? '' : '@2x'}`
  console.log('Creating', filename, '...')
  const sortedIconFiles = sortObject(iconFiles)
  Spritesmith.run({ src: Object.values(sortedIconFiles) }, async (err, result) => {
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
    const sortedCoordinates = sortObject(coordinates)
    await saveJson(`${filename}.json`, sortedCoordinates)
    fs.rmSync(tmpFolder, { recursive: true, force: true })
  })
}

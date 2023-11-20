import { z } from 'zod'

export const isV3String = (value: string) => {
  return value.endsWith('v3')
}

export const removeVersionStringFromArray = (array: Array<any>) => {
  const newArray = [...array]
  newArray.pop()
  return newArray
}

const UrlConfigObjectSchema = z.record(z.record(z.string()))

const separatorPrimary = '|' // also separates the version string
const separatorSecondary = '~'

const createObject = (urlString: string) => {
  const cleanString = urlString.replace('|v3', '') // we remove the version for the transformation and add it back later
  const object: UrlConfigObject = {}
  cleanString
    .split(separatorPrimary)
    .filter(Boolean)
    .forEach((layerCategories) => {
      const layerCategory = layerCategories.split(separatorSubcategory)
      object[layerCategory[0]] = layerCategory[1]
    })
  //.map((c) => {
  //   const array = c.split(separatorSubcategory).map((sub) => sub.split(separatorStyle))
  //   return Object.fromEntries(array)
  // })
  // .filter(Boolean)

  //

  console.log({ object })
  const parsed = UrlConfigObjectSchema.parse(object)
  return parsed.success ? parsed.data : {}
}

export const configCustomParseV3 = (value: string) => {
  const urlObject = createObject(value)

  // TODO: thake the URL object and merge it into the config
  return { urlObject, version: 'v3' }
}

const createString = (cat, subcat, style) => {
  return [cat, subcat, style].join(separatorSecondary)
}

export const configCustomStringifyV3 = (config: UrlConfigObject) => {
  // TODO: take the map object and prepare it in a format that createString understands
  const strings = config.map((c) => {})

  return [...createString(activeCatActiveSubcatActiveStyle), 'v3'].join(separatorPrimary)
}

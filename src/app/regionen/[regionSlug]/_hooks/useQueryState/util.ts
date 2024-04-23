import { z } from 'zod'

export function parseObject(schema: z.Schema, array: string[]) {
  const catchError = true
  if (catchError) {
    try {
      return schema.parse(array)
    } catch (e) {
      return null
    }
  } else {
    return schema.parse(array)
  }
}

export const range = (min, max) => z.coerce.number().gte(min).lte(max)
export const longitude = range(-180, 180)
export const latitude = range(-90, 90)
export const chars = (s) => z.enum(s.split(''))

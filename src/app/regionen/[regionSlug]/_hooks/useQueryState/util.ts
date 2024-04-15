import { z } from 'zod'

export function parseArray(schema: z.Schema, array: string[]) {
  try {
    return schema.parse(array)
  } catch (e) {
    return null
  }
}

export const number = z.coerce.number
export const range = (min, max) => number().gte(min).lte(max)
export const lng = range(-180, 180)
export const lat = range(-90, 90)
export const equals = (v) => range(v, v)
export const chars = (s) => z.enum(s.split(''))

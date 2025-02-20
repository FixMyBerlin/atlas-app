import { z } from 'zod'

export const UpdateUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  osmDescription: z.string().nullish(),
})

export const UpdateOsmDescription = z.object({
  osmDescription: z.string(),
})

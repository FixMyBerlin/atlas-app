import { z } from 'zod'

export const UpdateUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
})

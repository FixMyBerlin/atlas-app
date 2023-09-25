import { z } from 'zod'

export const CreateBikelaneVerificationSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateBikelaneVerificationSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteBikelaneVerificationSchema = z.object({
  id: z.number(),
})

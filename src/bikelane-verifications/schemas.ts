import { z } from 'zod'

export const VerificationSchema = z.object({
  id: z.number(),
  osm_type: z.literal('W'),
  osm_id: z.coerce.bigint(),
  verified_at: z.string().datetime(),
  verified_by: z.coerce.bigint(), // OSM User ID, _not_ OSM Username; Note, this is optional in DB but not in UI.
  verified: z.enum(['approved', 'rejected']),
  comment: z.string().optional(),
})

export const CreateVerificationSchema = VerificationSchema.pick({
  osm_type: true,
  osm_id: true,
  verified: true,
  comment: true,
})

export type TCreateVerificationSchema = z.infer<typeof CreateVerificationSchema>

export const verificationStatusOptions: [TVerificationStatus, TVerificationStatus] = [
  'approved',
  'rejected',
]
export type TVerificationStatus = 'approved' | 'rejected'

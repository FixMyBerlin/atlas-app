import { z } from 'zod'

export const VerificationSchema = z.object({
  id: z.number(),
  osm_type: z.literal('W'),
  osm_id: z.string(),
  // BigInt in db but number in the frontend
  // OSM User ID, _not_ OSM Username
  // Note, this is optional in DB but not in UI.
  verified_by: z.coerce.number(),
  verified_at: z.date(),
  verified: z.enum(['approved', 'rejected']),
  comment: z.string().optional().nullable(),
})

export const FormVerificationSchema = VerificationSchema.pick({
  osm_id: true,
  verified: true,
  comment: true,
})

export const CreateVerificationSchema = VerificationSchema.pick({
  osm_type: true,
  osm_id: true,
  verified_by: true,
  verified: true,
  comment: true,
})

export type TGetVerificationSchema = z.infer<typeof VerificationSchema>
export type TCreateVerificationSchema = z.infer<typeof CreateVerificationSchema>

export const verificationStatusOptions: [TVerificationStatus, TVerificationStatus] = [
  'approved',
  'rejected',
]
export type TVerificationStatus = 'approved' | 'rejected'

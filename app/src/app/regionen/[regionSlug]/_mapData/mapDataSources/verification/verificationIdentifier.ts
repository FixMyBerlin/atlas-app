// Define the verification tables
export const verificationApiIdentifier = [
  // TODO: this is redundant, as we also define this property with the attribute `verification.enabled`
  'bikelanes',
] as const

export type SourceVerificationApiIdentifier = (typeof verificationApiIdentifier)[number]

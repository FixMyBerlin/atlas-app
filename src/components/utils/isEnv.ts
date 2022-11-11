const isProductionBuild = process.env.NODE_ENV === 'production'

export const isNetlifyPreviewBuild =
  isProductionBuild && import.meta.env.CONTEXT !== 'production'

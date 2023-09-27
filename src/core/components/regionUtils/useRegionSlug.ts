import { useParam } from '@blitzjs/next'

export const useRegionSlug = () => {
  const slug = useParam('regionSlug', 'string')
  return slug!
}

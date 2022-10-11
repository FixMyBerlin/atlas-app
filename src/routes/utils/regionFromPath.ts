import { regions } from '@fakeServer/index'

export const regionFromPath = (regionPath: string) => {
  return regions.find((r) => r.path === regionPath)
}

import { regions } from 'src/users/components/fakeServer/index'

export const regionFromPath = (regionPath: string) => {
  return regions.find((r) => r.path === regionPath)
}

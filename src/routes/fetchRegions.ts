import { Region, regions } from '../pages'

// This is a fake for now. We will pull the regions from our DB later.
export const fetchRegions = async () => {
  return (await regions) as unknown as Region[]
}

import { regions } from '@fakeServer/index'

// This is a fake for now. We will pull the regions from our DB later.
export const fetchRegions = async () => {
  return await regions
}

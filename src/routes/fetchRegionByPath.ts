import { regionFromPath } from '../pages'
import { LocationGenerics } from './routes'

// This is a fake for now. We will pull the regions from our DB later.

export const fetchRegionByPath = async (
  regionPath: LocationGenerics['Params']['regionPath']
) => {
  return await regionFromPath(regionPath)
}

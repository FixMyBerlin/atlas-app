import { sourcesRaster } from '../Map/backgrounds/sourcesRaster.const'
import { visualisationsList } from '../Map/parkingLanes/visualisationsList.const'
import { filterUnfallatlassYears } from '../Map/unfallatlas/filterUnfallatlas'

export const mapConfig = {
  backgroundSources: sourcesRaster,
  dataSources: {
    boundaries: {
      visList: { default: { displayName: 'Grenzen' } },
      filter: null,
    },
    parkingLanes: {
      visList: visualisationsList,
      filter: null,
    },
    unfallatlas: {
      visList: { default: { displayName: 'Unfallatlas' } },
      filter: { year: filterUnfallatlassYears },
    },
  },
}

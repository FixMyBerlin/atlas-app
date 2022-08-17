import { backgroundLayer } from '../Map/backgrounds/sourcesRaster.const'
import { visualisationsList } from '../Map/parkingLanes/visualisationsList.const'
import { availableYears } from '../Map/unfallatlas/filterUnfallatlas'

export const mapConfig = {
  backgroundSources: backgroundLayer,
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
      filter: { year: availableYears },
    },
  },
}

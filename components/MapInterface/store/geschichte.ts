import { factoryParameters, pm, serializers } from 'geschichte'
import { SelectedSources } from './handleAddRemove'

export type GeschichteStore = {
  map: {
    lat: number
    lng: number
    zoom: number
  }
  currentBackground: string // TODO – SourcesRasterKey hier verwenden, aber vorher das _tiles aus dem object raus refactorn
  selectedSources: SelectedSources
}

// third param: (value?: V, initialValue?: V) => boolean  /** define an optional skip function which will determine if the parameter will be included in the url or not */
const geschichteConfig = {
  map: {
    lat: pm('lat', serializers.float, () => false),
    lng: pm('lng', serializers.float, () => false),
    zoom: pm('z', serializers.float, () => false),
  },
  currentBackground: pm('bg', serializers.string, () => false),
  selectedSources: pm('layers', serializers.arrayString, () => false),
}

// TODO – wenn Default-Value, dann verschwinden die Values aus der URL
// TODO – Parameter werden nicht nach A-Z sortiert, verändern Reihenfolge während der Arbeit
// TODO – Parameter sind nicht Error-Safe; sie müssten bereintigt werden
// TODO – Values: Parameter in serializer werden nicht sortiert; Reihenfolge click bestimmt Reihenfolge Werte
export const geschichteDefaultValues: GeschichteStore = {
  map: {
    lat: 52.4793,
    lng: 13.4381,
    zoom: 16,
  },
  currentBackground: 'default',
  selectedSources: ['parkingLanes', 'boundaries'],
}

export const { useQuery } = factoryParameters(
  geschichteConfig,
  geschichteDefaultValues
)

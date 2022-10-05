import { factoryParameters, pm, serializers } from 'geschichte'
import {
  MapDataConfigSourcesRasterIds,
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleFilterIds,
  MapDataConfigTopicStyleIds,
} from '../Map/mapData'
import { MapDataConfigThemeIds } from '../Map/mapData/themesMapDataConfig'
import { MapDataConfigTopicsWithState } from './mapDataConfigTopicsWithState'
import { objectSerializer } from './objectSerializer'

// These Types holds a combination of all Topic>Styles, even those that are not actually there.
// In other words: The Style part doe not know about the hierarchy of the Topic part.
export type TopicStyleKey =
  `${MapDataConfigTopicIds}-${MapDataConfigTopicStyleIds}`

export type TopicStyleFilterKey = `${TopicStyleKey}-${Exclude<
  MapDataConfigTopicStyleFilterIds,
  ''
>}`

export type TopicStyleFilterOptionKey = `${TopicStyleKey}-${Exclude<
  MapDataConfigTopicStyleFilterIds,
  ''
>}-${string}`

export type GeschichteStore = {
  map: {
    lat: number
    lng: number
    zoom: number
  }
  config: MapDataConfigTopicsWithState | null // TODO handle the NULL case at startup
  selectedBackgroundId: MapDataConfigSourcesRasterIds
  selectedThemeId: MapDataConfigThemeIds | null
  selectedTopicIds: MapDataConfigTopicIds[] | null
  selectedStyleKeys: TopicStyleKey[] | null
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[] | null
}

// third param: (value?: V, initialValue?: V) => boolean  /** define an optional skip function which will determine if the parameter will be included in the url or not */
const geschichteConfig = {
  map: {
    lat: pm('lat', serializers.float, () => false),
    lng: pm('lng', serializers.float, () => false),
    zoom: pm('z', serializers.float, () => false),
  },
  config: pm('config', objectSerializer, () => false),
  selectedBackgroundId: pm('bg', serializers.string, () => false),
  selectedThemeId: pm('theme', serializers.string, () => false),
  selectedTopicIds: pm('topics', serializers.arrayString, () => false),
  selectedStyleKeys: pm('styles', serializers.arrayString),
  selectedStylesFilterOptionKeys: pm('filters', serializers.arrayString),
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
  config: null,
  selectedBackgroundId: 'default',
  selectedThemeId: null,
  selectedTopicIds: null,
  selectedStyleKeys: null,
  selectedStylesFilterOptionKeys: null,
}

export const { useQuery } = factoryParameters(
  geschichteConfig,
  geschichteDefaultValues
)

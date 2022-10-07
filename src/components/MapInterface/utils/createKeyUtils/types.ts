import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleFilterIds,
  MapDataConfigTopicStyleIds,
} from '@components/MapInterface/mapData'

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

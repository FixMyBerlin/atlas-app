import { Serializer } from 'geschichte'
import { parse, stringify } from 'query-string'
import { TopicsConfig } from '../mapDataConfigTopicsWithState'

export const objectSerializer: Serializer<TopicsConfig> = {
  // string to object
  deserialize: (value: string | null): TopicsConfig | null => {
    return value ? JSON.parse(value) : null
  },
  // object to string
  serialize: (object?: TopicsConfig): string | null => {
    return JSON.stringify(object)
  },
}

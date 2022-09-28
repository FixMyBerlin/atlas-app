import { Serializer } from 'geschichte'
import { parse, stringify } from 'query-string'
import { MapDataConfigTopicsWithState } from '../mapDataConfigTopicsWithState'

export const objectSerializer: Serializer<MapDataConfigTopicsWithState> = {
  // string to object
  deserialize: (value: string | null): MapDataConfigTopicsWithState | null => {
    return value ? JSON.parse(value) : null
  },
  // object to string
  serialize: (object?: MapDataConfigTopicsWithState): string | null => {
    return JSON.stringify(object)
  },
}

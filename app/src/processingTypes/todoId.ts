// Autogenerated by `processing/steps/generateTypes.ts`
// Do not change this file manually
// To update, run `docker compose up processing`

export const bikelaneTodoIds = [
  'adjoiningOrIsolated',
  'advisoryOrExclusive',
  'missing_access_tag_240',
  'missing_access_tag_bicycle_road',
  'missing_segregated',
  'missing_traffic_sign',
  'missing_traffic_sign_244',
  'missing_traffic_sign_but_bicycle_designated',
  'missing_traffic_sign_but_bicycle_yes',
  'missing_traffic_sign_vehicle_destination',
  'needsClarification',
  'unexpected_bicycle_access_on_footway',
] as const
export type BikelaneTodoId = (typeof bikelaneTodoIds)[number]

export const roadTodoIds = ['deprecated_cycleway_shared'] as const
export type RoadTodoId = (typeof roadTodoIds)[number]

export const todoIds = [...bikelaneTodoIds, ...roadTodoIds] as const
export type TodoId = BikelaneTodoId | RoadTodoId

// DO NOT EDIT MANUALLY
// This file was automatically generated by `processing/steps/generateTypes.ts`
// To update, run `docker compose up processing`

export const bikelaneTodoIds = [
  'adjoining_or_isolated',
  'advisory_or_exclusive',
  'currentness_too_old',
  'missing_access_tag_240',
  'missing_access_tag_bicycle_road',
  'missing_segregated',
  'missing_traffic_sign',
  'missing_traffic_sign_244',
  'missing_traffic_sign_vehicle_destination',
  'needs_clarification',
  'unexpected_bicycle_access_on_footway',
] as const
export type BikelaneTodoId = (typeof bikelaneTodoIds)[number]

export const roadTodoIds = ['deprecated_cycleway_shared'] as const
export type RoadTodoId = (typeof roadTodoIds)[number]

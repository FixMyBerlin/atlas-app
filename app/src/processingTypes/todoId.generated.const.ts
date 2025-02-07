// DO NOT EDIT MANUALLY
// This file was automatically generated by `processing/steps/generateTypes.ts`
// To update, run `docker compose up processing`

export const bikelaneTodoIdsTableAndField = [
  'adjoining_or_isolated',
  'advisory_or_exclusive',
  'missing_access_tag_240',
  'missing_access_tag_bicycle_road',
  'missing_segregated',
  'needs_clarification',
  'unexpected_bicycle_access_on_footway',
] as const
export type BikelaneTodoIdTableAndField = (typeof bikelaneTodoIdsTableAndField)[number]

export const bikelaneTodoIdsTableOnly = [
  'currentness_too_old',
  'missing_surface',
  'missing_traffic_sign',
  'missing_traffic_sign_244',
  'missing_traffic_sign_vehicle_destination',
  'missing_width',
] as const
export type BikelaneTodoIdTableOnly = (typeof bikelaneTodoIdsTableOnly)[number]

export const roadTodoIdsTableAndField = ['deprecated_cycleway_shared'] as const
export type RoadTodoIdTableAndField = (typeof roadTodoIdsTableAndField)[number]

export const roadTodoIdsTableOnly = [] as const
export type RoadTodoIdTableOnly = (typeof roadTodoIdsTableOnly)[number]

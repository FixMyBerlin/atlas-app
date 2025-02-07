import {
  bikelaneTodoIdsTableAndField,
  bikelaneTodoIdsTableOnly,
  roadTodoIdsTableAndField,
  roadTodoIdsTableOnly,
} from './todoId.generated.const'

export const bikelaneTodoIds = [
  ...bikelaneTodoIdsTableAndField,
  ...bikelaneTodoIdsTableOnly,
] as const
export type BikelaneTodoId = (typeof bikelaneTodoIds)[number]

export const roadTodoIds = [...roadTodoIdsTableAndField, ...roadTodoIdsTableOnly] as const
export type RoadTodoId = (typeof roadTodoIds)[number]

const additionalTodos = ['test_maproulette'] as const
export const todoIds = [...bikelaneTodoIds, ...roadTodoIds, ...additionalTodos] as const
export type TodoId = (typeof todoIds)[number]

export const todoIdsTableOnly = [...roadTodoIdsTableOnly, ...bikelaneTodoIdsTableOnly] as const

import { bikelaneTodoIds, roadTodoIds } from './todoId.generated.const'

const additionalTodos = ['test_maproulette'] as const
export const todoIds = [...bikelaneTodoIds, ...roadTodoIds, ...additionalTodos] as const
export type TodoId = (typeof todoIds)[number]

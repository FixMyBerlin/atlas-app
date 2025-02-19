import { todoIds } from '@/src/data/processingTypes/todoIds.const'

export const todoMarkdownToMaprouletteCampaignKey = (todos: string | undefined) => {
  return todoIds
    .map((project) => {
      if (todos?.includes(`* ${project}\n`)) {
        return project
      }
    })
    .filter(Boolean)
}

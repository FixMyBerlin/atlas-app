// We receive `{radioButtonScope}-{id}` and need to clean it up
export const cleanupTargetId = (rawTarget: string, scope: string) => {
  const cleanupScope = rawTarget.replaceAll(scope, '')
  return cleanupScope.startsWith('--')
    ? cleanupScope.substring(2)
    : cleanupScope
}

export const cleanupTargetIdFromEvent = (
  event: React.ChangeEvent<HTMLFormElement>,
  scope: string
) => cleanupTargetId(event.target.id, scope)

// We receive `{radioButtonScope}-{id}` and need to clean it up
export const cleanupTargetId = (event, scope) =>
  event.target.id.replace(scope, '').replace('-', '')

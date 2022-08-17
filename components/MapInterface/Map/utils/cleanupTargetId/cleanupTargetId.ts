// We receive `{radioButtonScope}-{id}` and need to clean it up
export const cleanupTargetId = (
  event: React.ChangeEvent<HTMLFormElement>,
  scope: string
) => event.target.id.replace(scope, '').replace('-', '')

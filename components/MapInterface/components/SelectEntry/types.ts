export type EntryProps = {
  /** @desc scope to separate input-id's from one form and another */
  scope: string
  id: string
  label: string
  desc?: string
  active: boolean
  disabled?: boolean
}

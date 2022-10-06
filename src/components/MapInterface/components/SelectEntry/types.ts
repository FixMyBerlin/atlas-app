export type EntryProps = {
  /** @desc scope to separate input-id's from one form and another */
  scope: string
  id: string
  dataTopicId?: string
  dataStyleId?: string
  dataFilterId?: string
  dataFilterOptionId?: string
  label: string
  desc?: string
  active: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

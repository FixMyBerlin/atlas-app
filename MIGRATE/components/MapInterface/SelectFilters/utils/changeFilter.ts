import {
  addGeschichte,
  GeschichteStore,
  removeGeschichte,
  TopicStyleFilterOptionKey,
} from '../../store'

type Props = {
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
  changeKey: TopicStyleFilterOptionKey
  state: GeschichteStore
}

export const changeFilter = ({
  selectedStylesFilterOptionKeys,
  changeKey,
  state,
}: Props) => {
  if (selectedStylesFilterOptionKeys?.includes(changeKey)) {
    return removeGeschichte<TopicStyleFilterOptionKey>(
      state.selectedStylesFilterOptionKeys,
      changeKey
    )
  } else {
    return addGeschichte<TopicStyleFilterOptionKey>(
      state.selectedStylesFilterOptionKeys,
      changeKey
    )
  }
}

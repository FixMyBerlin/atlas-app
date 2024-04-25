import { CloseButton } from 'src/app/_components/CloseButton/CloseButton'

type Props = {
  count: number
  handleClose: () => void
}

export const InspectorHeader = ({ count, handleClose }: Props) => {
  return (
    <>
      <h2 className="text-base font-medium text-gray-900">
        Eigenschaften <span>({count})</span>
      </h2>
      <CloseButton onClick={handleClose} positionClasses="top-3 right-3" />
    </>
  )
}

import { buttonStyles } from '@components/Link'
import clsx from 'clsx'

type ButtonProps = {
  visible: boolean
  handleClick: () => void
  disabled: boolean
  children: React.ReactNode
}

export const ApproveButton = ({
  visible,
  handleClick,
  disabled,
  children,
}: ButtonProps) => {
  if (!visible) return null
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        buttonStyles,
        'bg-white py-1 px-3',
        disabled
          ? 'cursor-not-allowed border-gray-300 text-gray-400 shadow-sm hover:bg-white'
          : 'border-gray-400 shadow-md'
      )}
    >
      {children}
    </button>
  )
}

export const RejectButton = ({
  visible,
  handleClick,
  disabled,
  children,
}: ButtonProps) => {
  if (!visible) return null
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        buttonStyles,
        'bg-white py-1 px-3',
        disabled
          ? 'cursor-not-allowed border-gray-300 text-gray-400 shadow-sm hover:bg-white'
          : 'border-gray-400 shadow-md'
      )}
    >
      {children}
    </button>
  )
}

import React, { useState } from 'react'
import { ModalDialog, ModalDialogProps } from './ModalDialog'

export type Props = Pick<
  ModalDialogProps,
  'title' | 'icon' | 'buttonCloseName'
> & {
  icon?: ModalDialogProps['icon']
  triggerIcon: React.ReactNode
  children: React.ReactNode
}

export const IconModal: React.FC<Props> = ({
  title,
  icon = 'info',
  children,
  buttonCloseName = 'Schließen',
  triggerIcon,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="inline-flex flex-none grow-0 items-center rounded-full border border-transparent bg-slate-300 px-1 py-1 text-sm font-medium leading-4 text-gray-500 shadow-sm hover:bg-yellow-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        onClick={() => setOpen(true)}
      >
        {triggerIcon}
      </button>
      <ModalDialog
        title={title}
        icon={icon}
        open={open}
        setOpen={setOpen}
        buttonCloseName={buttonCloseName}
      >
        {children}
      </ModalDialog>
    </>
  )
}
